require("dotenv").config();
const faunadb = require("faunadb");
const q = faunadb.query;

async function setupFaunaDB() {
  console.info("Attempting to create the DB schemas...");

  const key = checkForFaunaKey();

  const client = new faunadb.Client({
    secret: key,
  });

  let createdUsers = false;
  try {
    const createUsers = await client.query(
      q.CreateCollection({
        name: "users",
      })
    );
    if (createUsers) {
      createdUsers = true;
    }
  } catch (e) {
    if (e.message === "instance already exists") {
      createdUsers = true;
    } else {
      return {
        success: false,
        error: e,
      };
    }
  }

  let createdStructure = false;
  if (createdUsers) {
    console.log("Created Users successfully. Creating structure now...");
    try {
      await client.query(
        q.Do(
          q.CreateCollection({
            name: "schools",
            permissions: {
              create: q.Collection("users"),
            },
          }),
          q.CreateCollection({
            name: "semesters",
            permissions: {
              create: q.Collection("users"),
            },
          }),
          q.CreateCollection({
            name: "classes",
            permissions: {
              create: q.Collection("users"),
            },
          })
        )
      );
      createdStructure = true;
    } catch (e) {
      if (e.message === "instance already exists") {
        createdStructure = true;
      } else {
        console.error("There was a problem bootstrapping the db: ", e);
        return {
          success: false,
          error: e,
        };
      }
    }
  }

  if (createdStructure) {
    console.log("Created structure successfully. Creating indexes now...");
    try {
      await client.query(
        q.Do(
          q.CreateIndex({
            name: "users_by_id",
            source: q.Collection("users"),
            terms: [
              {
                field: ["data", "auth_id"],
              },
            ],
            unique: true,
          })
        )
      );
      await client.query(
        q.Do(
          q.CreateIndex({
            // this index is optional but useful in development for browsing users
            name: `all_users`,
            source: q.Collection("users"),
          })
        )
      );
      await client.query(
        q.Do(
          q.CreateIndex({
            name: "all_schools",
            source: q.Collection("schools"),
            permissions: {
              read: q.Collection("users"),
            },
          })
        )
      );
      await client.query(
        q.Do(
          q.CreateIndex({
            name: "all_semesters",
            source: q.Collection("semesters"),
            permissions: {
              read: q.Collection("users"),
            },
          })
        )
      );
      await client.query(
        q.Do(
          q.CreateIndex({
            name: "all_classes",
            source: q.Collection("classes"),
            permissions: {
              read: q.Collection("users"),
            },
          })
        )
      );
      await client.query(
        q.Do(
          q.CreateIndex({
            name: "semesters_by_school",
            source: q.Collection("semesters"),
            terms: [
              {
                field: ["data", "school"],
              },
            ],
            permissions: {
              read: q.Collection("users"),
            },
          })
        )
      );
      await client.query(
        q.Do(
          q.CreateIndex({
            name: "classes_by_semester",
            source: q.Collection("classes"),
            terms: [
              {
                field: ["data", "semester"],
              },
            ],
            permissions: {
              read: q.Collection("users"),
            },
          })
        )
      );
      return {
        success: true,
      };
    } catch (e) {
      if (e.message === "instance already exists") {
        // All is well
      } else {
        console.error("There was a problem bootstrapping the db: ", e);
        return {
          success: false,
          error: e,
        };
      }
    }
  }
}

function checkForFaunaKey() {
  if (!process.env.FAUNA_SECRET_KEY) {
    console.error("FAUNA_SECRET_KEY NOT FOUND");
    process.exit(1);
  }

  console.log(`Found FAUNA_SECRET_KEY environment variable in env variables`);
  return process.env.FAUNA_SECRET_KEY;
}

(async function () {
  let setupComplete = await setupFaunaDB();
  if (setupComplete.success) {
    console.log(`Bootstraping DB schemas was successful!`);
  } else {
    console.log(
      `There was an issue bootstrapping the DB schemas due to: ${setupComplete.error}`
    );
    process.exit(1);
  }
})();
