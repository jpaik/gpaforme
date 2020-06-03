import { createClass, getClasses } from "~/models/Classes";

export const state = () => ({
  classes: [],
});
export const getters = {
  getClasses(state) {
    return state.classes;
  },
};
export const mutations = {
  addClass(state, newClass) {
    state.classes.push(newClass);
  },
  setClasses(state, classes) {
    state.classes = classes;
  },
};
export const actions = {
  getClassesForSemester({ commit }, semesterID) {
    getClasses(semesterID).then((classes) => {
      commit("setClasses", classes);
    });
  },
  createClass({ commit }, data) {
    createClass(data).then((resp) => {
      commit("addClass", resp);
    });
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
