import { addClass, getClasses } from "~/models/Classes";
import LSModel from "~/models/LSModel";

export const state = () => ({ classes: [] });
export const getters = {
  getClasses: (state) => state.classes,
  getClassesForSemester: (state) => (semesterId) =>
    state.classes.filter((s) => s.semester === semesterId),
  getClassById: (state) => (id) => state.classes.find((c) => c.id === id),
};
export const mutations = {
  addClass(state, newClass) {
    state.classes.push(newClass);
  },
  setClasses(state, classes) {
    state.classes = classes;
  },
  updateClass(state, newData) {
    const idx = state.classes.findIndex((c) => newData.id === c.id);
    const cls = state.classes[idx];
    state.classes.splice(idx, 1, {
      ...cls,
      ...newData,
    });
  },
};
export const actions = {
  getClassesForSemester({ commit, getters }, semesterId) {
    if (getters["isAuthenticated"]) {
      getClasses(semesterId).then((classes) => {
        commit("setClasses", classes);
      });
    } else {
      // Do localStorage
      commit("setClasses", LSModel.getLocalClasses(semesterId));
    }
  },
  /**
   *
   * @param {*} data expects semesterId and classData
   */
  createClass({ commit, getters }, data) {
    if (getters["isAuthenticated"]) {
      addClass(data.semesterId, data.classData).then((resp) => {
        commit("addClass", resp);
      });
    } else {
      commit(
        "addClass",
        LSModel.addLocalClass(data.semesterId, data.classData)
      );
    }
  },
  updateClassName({ commit, getters }, { classId, newName }) {
    const toUpdate = getters["getClassById"](classId);
    const toUpdateData = {
      ...toUpdate,
      name: newName,
    };
    if (getters["isAuthenticated"]) {
      // Change
    } else {
      // Do localStorage
      commit(
        "updateClass",
        LSModel.updateLocalClass(toUpdate.id, toUpdateData)
      );
    }
  },
};
export default { state, actions, mutations, getters };
