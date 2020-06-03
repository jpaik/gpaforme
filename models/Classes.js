import { q, client } from "../helpers/db";

export function addClass(classData, semesterID) {
  const me = q.Identity();

  return client
    .query(
      q.Create(q.Collection("classes"), {
        data: {
          ...classData,
          semester: q.Ref(q.Collections("semesters"), semesterID),
          owner: me,
        },
        permissions: {
          read: me,
          write: me,
        },
      })
    )
    .then((resp) => resp)
    .catch((e) => e);
}

export function getClasses(semesterID) {
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
        .then((resp) => resp);
    })
    .catch((err) => err);
}

export function deleteClass(classID) {
  return client
    .query(q.Delete(classID))
    .then((resp) => resp)
    .catch((err) => err);
}

export function updateClass(classID, newClassData) {
  return client
    .query(
      q.Update(q.Ref(q.Collection("classes"), classID), {
        data: newClassData,
      })
    )
    .then((resp) => resp)
    .catch((err) => err);
}
