import faunadb from "faunadb";
const q = faunadb.query;

export async function addClass(client, semesterRef, classData) {
  const me = await client.query(q.Identity());
  return client
    .query(
      q.Create(q.Collection("classes"), {
        data: {
          ...classData,
          semester: semesterRef,
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

export function getAllClasses(client) {
  return client
    .query(
      q.Map(q.Paginate(q.Match(q.Ref("indexes/all_classes"))), (ref) =>
        q.Get(ref)
      )
    )
    .then((resp) => {
      if (resp.data) {
        const classes = resp.data;
        return classes.map((c) => {
          return {
            ...c.data,
            id: c.ref.value.id,
            ref: c.ref,
          };
        });
      }
      return [];
    })
    .catch((err) => err);
}
export function getClassesForSemester(client, semesterID) {
  return client
    .query(q.Get(q.Ref(`collections/semesters/${semesterID}`)))
    .then((semester) => {
      return client
        .query(
          q.Map(
            q.Paginate(q.Match(q.Index("classes_by_semester"), semester.ref)),
            (ref) => q.Get(ref)
          )
        )
        .then((resp) => {
          if (resp.data) {
            const classes = resp.data;
            return classes.map((c) => {
              return {
                ...c.data,
                id: c.ref.value.id,
                ref: c.ref,
              };
            });
          }
          return [];
        });
    })
    .catch((err) => err);
}

export function deleteClass(client, classRef) {
  return client
    .query(q.Delete(classRef))
    .then((resp) => resp)
    .catch((err) => err);
}

export function updateClass(client, classID, newClassData) {
  return client
    .query(
      q.Update(q.Ref(q.Collection("classes"), classID), {
        data: newClassData,
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
