import { addClass, getClasses, deleteClass } from "~/models/Classes";

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
  deleteClass(state, id) {
    if (state.classes.length > 1) {
      const idx = state.classes.findIndex((c) => id === c.id);
      state.classes.splice(idx, 1);
    }
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
  createClass({ commit, getters, rootGetters, dispatch }, semesterId) {
    const activeSemesterId =
      semesterId || rootGetters["semesters/getActiveSemester"].id;
    const classData = {
      credits: null,
      grade: 4,
      name: "",
      comments: "",
      semester: activeSemesterId,
    };
    if (getters["isAuthenticated"]) {
      addClass(activeSemesterId, classData).then((resp) => {
        commit("addClass", resp);
      });
    } else {
      let latestClasses = [
        ...getters["getClassesForSemester"](activeSemesterId),
      ];
      let latestClassId = 0;
      if (latestClasses.length) {
        latestClassId = latestClasses
          .sort((a, b) => a.id.split("_").pop() - b.id.split("_").pop())
          .pop().id || [0];
        latestClassId = parseInt(latestClassId.split("_").pop());
      }
      const newClass = {
        ...classData,
        id: activeSemesterId + "_" + (latestClassId + 1),
      };
      commit("addClass", newClass);
      dispatch("triggerSaving", null, { root: true });
    }
  },
  deleteClass({ commit, getters, dispatch }, classId) {
    if (getters["isAuthenticated"]) {
      deleteClass(classId).then((resp) => {
        commit("deleteClass", resp);
      });
    } else {
      // Do localStorage
      commit("deleteClass", classId);
      dispatch("triggerSaving", null, { root: true });
    }
  },
  updateClassValue({ commit, getters, dispatch }, data) {
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
      dispatch("triggerSaving", null, { root: true });
    }
  },
  deleteClassesForSemester({ commit, getters }, semesterId) {
    if (getters["isAuthenticated"]) {
      // Change
    } else {
      // Do localStorage
      const classes = getters["getClassesForSemester"](semesterId);
      classes.forEach((c) => commit("deleteClass", c.id));
    }
  },
};
export default { state, actions, mutations, getters };
