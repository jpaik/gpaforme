export const state = () => ({
  school: {},
  semesters: {},
});
export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn;
  },
  loggedInUser(state) {
    return state.auth.user;
  },
};
export const mutations = {};
export const actions = {};

export default {
  state,
  actions,
  mutations,
  getters,
};
