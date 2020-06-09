import faunadb from "faunadb";
import { addSchool, getSchools } from "~/models/Schools";
import { addSemester } from "~/models/Semesters";
import { addClass } from "~/models/Classes";

export function checkLocalStorage() {
  const ls = localStorage || window.localStorage;
  if (ls) {
    const gpaforme =
      ls.getItem("gpaforme") !== null
        ? JSON.parse(ls.getItem("gpaforme"))
        : false;
    if (gpaforme) {
      if (
        gpaforme.schools &&
        gpaforme.schools.schools &&
        gpaforme.schools.schools[0] !== undefined
      ) {
        return true;
      }
    } else {
      return false;
    }
  }
  return false;
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function migrateToFauna(store) {
  const ls = localStorage || window.localStorage;
  const gpaforme =
    ls.getItem("gpaforme") !== null
      ? JSON.parse(ls.getItem("gpaforme"))
      : false;

  const client = new faunadb.Client({
    secret: store.getters["faunaKey"],
  });

  const allSchools = await getSchools(client);
  if (gpaforme && !allSchools.length) {
    store.commit("changeMigrating", true);
    const keyMap = {}; // Holds old_ls_id: new_fauna_id
    const schools = gpaforme.schools.schools;
    await asyncForEach(schools, async (s) => {
      const newSchool = await addSchool(client, s);
      keyMap[s.id] = newSchool.ref;
      store.commit("schools/addSchool", newSchool);
    });

    const semesters = gpaforme.semesters.semesters;
    await asyncForEach(semesters, async (s) => {
      if (s && s.school) {
        const newSemester = await addSemester(client, keyMap[s.school], s);
        keyMap[s.id] = newSemester.ref;
        store.commit("semesters/addSemester", newSemester);
      }
    });

    const classes = gpaforme.classes.classes;
    await asyncForEach(classes, async (c) => {
      if (c && c.semester) {
        const newClass = await addClass(client, keyMap[c.semester], c);
        keyMap[c.id] = newClass.ref;
        store.commit("classes/addClass", newClass);
      }
    });
    store.commit("changeMigrating", false);
  }
}

export default ({ app, store }, inject) => {
  inject("migrateToFauna", () => migrateToFauna(store));
  app.migrateToFauna = () => migrateToFauna(store);
};
