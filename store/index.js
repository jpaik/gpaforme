export const state = () => ({});
export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn;
  },
  loggedInUser(state) {
    return state.auth.user;
  },
  faunaKey(state) {
    return state.auth.user[process.env.FAUNA_LOCAL_TOKEN + "fauna_token"];
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
