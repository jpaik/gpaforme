import faunadb from "faunadb";
const q = faunadb.query;

export async function addSchool(client, schoolData) {
  const me = await client.query(q.Identity());

  return client
    .query(
      q.Create(q.Collection("schools"), {
        data: {
          ...schoolData,
          owner: me,
        },
        permissions: {
          read: me,
          write: me,
        },
      })
    )
    .then((resp) => {
      if (resp) {
        return {
          ...resp.data,
          id: resp.ref.value.id,
          ref: resp.ref,
        };
      }
      return resp;
    })
    .catch((e) => e);
}

export function getSchools(client) {
  return client
    .query(
      q.Map(q.Paginate(q.Match(q.Ref("indexes/all_schools"))), (ref) =>
        q.Get(ref)
      )
    )
    .then((resp) => {
      if (resp.data) {
        const schools = resp.data;
        return schools.map((s) => {
          return {
            ...s.data,
            id: s.ref.value.id,
            ref: s.ref,
          };
        });
      }
      return [];
    });
}

export function deleteSchool(client, school) {
  return client
    .query(
      q.Map(
        q.Paginate(
          q.Match(
            q.Index("semesters_by_school"),
            q.Ref(q.Collections("semesters"), school.ref.value.id)
          )
        ),
        q.Lambda("X", q.Delete(q.Select("ref", q.Get(q.Var("X")))))
      )
    )
    .then(() => {
      return client.query(q.Delete(school.ref));
    })
    .catch((err) => err);
}

export function updateSchoolName(client, schoolRefID, newName) {
  return client
    .query(
      q.Update(q.Ref(q.Collection("schools"), schoolRefID), {
        data: {
          name: newName,
        },
      })
    )
    .then((resp) => {
      if (resp) {
        return {
          ...resp.data,
          id: resp.ref.value.id,
          ref: resp.ref,
        };
      }
      return resp;
    })
    .catch((err) => err);
}

export function updateSchoolGPAType(client, schoolRefID, gpaType) {
  return client
    .query(
      q.Update(q.Ref(q.Collection("schools"), schoolRefID), {
        data: {
          gpa: gpaType,
        },
      })
    )
    .then((resp) => {
      if (resp) {
        return {
          ...resp.data,
          id: resp.ref.value.id,
          ref: resp.ref,
        };
      }
      return resp;
    })
    .catch((err) => err);
}
