import createPersistedState from "vuex-persistedstate";

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
function checkOrCreateDefaultClasses(key) {
  const currentStore = JSON.parse(localStorage.getItem(key));
  if (!currentStore) {
    return {
      schools: {
        schools: createDefaultSchool(),
      },
      semesters: {
        semesters: createDefaultSemesters(),
      },
      classes: {
        classes: createDefaultClasses(),
      },
    };
  }
  if (
    currentStore.classes &&
    (!currentStore.classes.classes || !currentStore.classes.classes.length)
  ) {
    const classes = createDefaultClasses(); // Returns array of classes
    currentStore.classes.classes = classes;
  }
  if (
    currentStore.semesters &&
    (!currentStore.semesters.semesters ||
      !currentStore.semesters.semesters.length)
  ) {
    const semesters = createDefaultSemesters(); // Returns array of semesters
    currentStore.semesters.semesters = semesters;
  }
  if (
    currentStore.schools.schools &&
    (!currentStore.schools.schools || !currentStore.schools.schools.length)
  ) {
    const school = createDefaultSchool(); // Returns array of one school object
    currentStore.schools.schools = school;
  }
  return currentStore;
}

export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: "gpaforme",
      paths: ["schools.schools", "semesters.semesters", "classes.classes"],
      getState: (key) =>
        store.state.auth.loggedIn
          ? getAuthenticatedUserData(store, key)
          : checkOrCreateDefaultClasses(key),
    })(store);
  });
};
