import { addClass, getClasses } from "~/models/Classes";

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
  pullClassesForSemester({ commit, getters }, semesterId) {
    if (getters["isAuthenticated"]) {
      getClasses(semesterId).then((classes) => {
        commit("setClasses", classes);
      });
    }
  },
  /**
   *
   * @param {*} data expects semester and rest of data
   */
  createClass({ commit, getters }, data) {
    if (getters["isAuthenticated"]) {
      addClass(data.semester, data).then((resp) => {
        commit("addClass", resp);
      });
    } else {
      const latestClassId = [...getters["getClassesForSemester"](data.semester)]
        .sort((a, b) => a.id.split("_").pop() - b.id.split("_").pop())
        .pop().id || [0];
      const newClass = {
        ...data,
        id: data.semester + "_" + (latestClassId.split("_").pop() + 1),
      };
      commit("addClass", newClass);
    }
  },
  updateClassValue({ commit, getters }, data) {
    const toUpdate = getters["getClassById"](data.id);
    const toUpdateData = {
      ...toUpdate,
      ...data,
    };
    if (getters["isAuthenticated"]) {
      // Change
    } else {
      // Do localStorage
      commit("updateClass", toUpdateData);
    }
  },
};
export default { state, actions, mutations, getters };
