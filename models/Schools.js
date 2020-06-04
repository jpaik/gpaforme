import { q, client } from "../helpers/db";

export function addSchool(schoolData) {
  const me = q.Identity();

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
    .then((resp) => resp)
    .catch((e) => e);
}

export function getSchools() {
  return client
    .query(
      q.Map(q.Paginate(q.Match(q.Ref("indexes/all_schools"))), (ref) =>
        q.Get(ref)
      )
    )
    .then((resp) => resp);
}

export function deleteSchool(school) {
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

export function updateSchoolName(schoolRefID, newName) {
  return client
    .query(
      q.Update(q.Ref(q.Collection("schools"), schoolRefID), {
        data: {
          name: newName,
        },
      })
    )
    .then((resp) => resp)
    .catch((err) => err);
}

export function updateSchoolGPAType(schoolRefID, gpaType) {
  return client
    .query(
      q.Update(q.Ref(q.Collection("schools"), schoolRefID), {
        data: {
          gpa: gpaType,
        },
      })
    )
    .then((resp) => resp)
    .catch((err) => err);
}
