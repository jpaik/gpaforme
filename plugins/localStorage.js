import createPersistedState from "vuex-persistedstate";

function getAuthenticatedUserData(store, key) {
  store.dispatch("schools/getAllSchools");
  store.dispatch("semesters/getAllSemesters");
  store.dispatch("classes/getAllClasses");
  return JSON.parse(localStorage.getItem(key));
}

export default ({ store }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: "gpaforme",
      paths: ["schools.schools", "semesters.semesters", "classes.classes"],
      getState: (key) =>
        store.state.auth.loggedIn
          ? getAuthenticatedUserData(store, key)
          : JSON.parse(localStorage.getItem(key)),
    })(store);
  });
};
