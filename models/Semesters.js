import { q, client } from "../helpers/db";

export function addSemester(schoolID, semesterData) {
  const me = q.Identity();

  return client
    .query(
      q.Create(q.Collection("semesters"), {
        data: {
          ...semesterData,
          school: q.Ref(q.Collections("schools"), schoolID),
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

export function getSemesters(schoolID) {
  return client
    .query(q.Get(q.Ref(`collections/schools/${schoolID}`)))
    .then((school) => {
      return client
        .query(
          q.Map(
            q.Paginate(q.Match(q.Index("semesters_by_school"), school.ref)),
            (ref) => q.Get(ref)
          )
        )
        .then((resp) => resp);
    })
    .catch((err) => err);
}

export function deleteSemester(semester) {
  return client
    .query(
      q.Map(
        q.Paginate(
          q.Match(
            q.Index("classes_by_semester"),
            q.Ref(q.Collections("classes"), semester.ref.value.id)
          )
        ),
        q.Lambda("X", q.Delete(q.Select("ref", q.Get(q.Var("X")))))
      )
    )
    .then(() => {
      return client.query(q.Delete(semester.ref));
    })
    .catch((err) => err);
}

export function updateSemesterName(semesterID, newName) {
  return client
    .query(
      q.Update(q.Ref(q.Collection("semesters"), semesterID), {
        data: {
          name: newName,
        },
      })
    )
    .then((resp) => resp)
    .catch((err) => err);
}
