import createPersistedState from "vuex-persistedstate";
import { checkOldLocalStorage, convertOldToNew } from "./lsMigration";

function getAuthenticatedUserData(store) {
  store.dispatch("schools/getAllSchools");
  store.dispatch("semesters/getAllSemesters");
  store.dispatch("classes/getAllClasses");
  return null;
}

function createDefaultSchool() {
  const defaultSchool = {
    id: "default",
    name: "school",
    scale: "plus",
    active: true,
  };
  return [defaultSchool];
}

function createDefaultClasses() {
  const defaultClass = {
    id: 0,
    credits: null,
    grade: 4,
    name: "",
    comments: "",
    semester: "default_0",
  };
  return [
    ...[0, 1, 2, 3, 4].map((id) => {
      return { ...defaultClass, id: "default_0_" + id };
    }),
    ...[0, 1, 2, 3, 4].map((id) => {
      return { ...defaultClass, id: "default_1_" + id, semester: "default_1" };
    }),
  ];
}
function createDefaultSemesters() {
  const defaultSemester = {
    id: 0,
    name: "",
    school: "default",
    active: false,
  };
  return [0, 1].map((id) => {
    return { ...defaultSemester, id: "default_" + id, active: id === 0 };
  });
}

/**
 * Creates default classes if they don't exist if schema is Local Storage.
 */
function checkOrCreateDefaultClasses(store, key) {
  const currentStore = JSON.parse(localStorage.getItem(key));
  const defaultSchools = createDefaultSchool();
  const defaultSemesters = createDefaultSemesters();
  const defaultClasses = createDefaultClasses();
  if (!currentStore) {
    return {
      schools: {
        schools: defaultSchools,
      },
      semesters: {
        semesters: defaultSemesters,
      },
      classes: {
        classes: defaultClasses,
      },
    };
  }
  if (
    currentStore.classes &&
    (!currentStore.classes.classes || !currentStore.classes.classes.length)
  ) {
    currentStore.classes.classes = defaultClasses;
  }
  if (
    currentStore.semesters &&
    (!currentStore.semesters.semesters ||
      !currentStore.semesters.semesters.length)
  ) {
    currentStore.semesters.semesters = defaultSemesters;
  }
  if (
    currentStore.schools.schools &&
    (!currentStore.schools.schools || !currentStore.schools.schools.length)
  ) {
    currentStore.schools.schools = defaultSchools;
  }
  return currentStore;
}

export default ({ store }) => {
  window.onNuxtReady(() => {
    const ls = localStorage || window.localStorage;
    // If localStorage key gpaforme hasn't been defined yet, check for migration
    if (!ls.getItem("gpaforme") || ls.getItem("gpaforme") === null) {
      if (checkOldLocalStorage()) {
        convertOldToNew();
      }
    }
    createPersistedState({
      key: "gpaforme",
      paths: ["schools.schools", "semesters.semesters", "classes.classes"],
      getState: (key) =>
        store.state.auth.loggedIn
          ? getAuthenticatedUserData(store, key)
          : checkOrCreateDefaultClasses(store, key),
    })(store);
  });
};
