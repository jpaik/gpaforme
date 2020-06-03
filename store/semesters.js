import { createSemester, getSemesters } from "~/models/Semesters";

export const state = () => ({
  semesters: [],
});
export const getters = {
  getSemesters(state) {
    return state.semesters;
  },
};
export const mutations = {
  addSemester(state, newSemester) {
    state.semesters.push(newSemester);
  },
  setSemesters(state, semesters) {
    state.semesters = semesters;
  },
};
export const actions = {
  getSemestersForSchool({ commit }, schoolID) {
    getSemesters(schoolID).then((semesters) => {
      commit("setSemesters", semesters);
    });
  },
  createSemester({ commit }, data) {
    createSemester(data).then((resp) => {
      commit("addSemester", resp);
    });
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
