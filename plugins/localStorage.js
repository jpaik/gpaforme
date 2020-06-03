import createPersistedState from "vuex-persistedstate";

function getAuthenticatedUserData(store, key) {
  store.dispatch("getAllSchools");
  store.dispatch("getAllSemesters");
  store.dispatch("getAllSchools");
  return localStorage.getItem(key);
}

export default ({ store, $auth }) => {
  createPersistedState({
    key: "gpaforme",
    paths: ["schools", "semesters", "classes"],
    getState: (key) =>
      $auth.loggedIn
        ? getAuthenticatedUserData(store, key)
        : localStorage.getItem(key),
  })(store);
};
