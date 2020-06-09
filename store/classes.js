import {
  addClass,
  getClassesForSemester,
  getAllClasses,
  deleteClass,
  updateClass,
} from "~/models/Classes";

export const state = () => ({ classes: [] });
export const getters = {
  getClasses: (state) => state.classes,
  getClassesForSemester: (state, getters, rootState, rootGetters) => (
    semesterId
  ) => {
    if (rootGetters["isAuthenticated"]) {
      return state.classes.filter((s) => s.semester.value.id === semesterId);
    }
    return state.classes.filter((s) => s.semester === semesterId);
  },
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
  deleteAll(state) {
    state.classes = [];
  },
};
export const actions = {
  getClassesForSemester({ commit, rootGetters }, semesterId) {
    if (rootGetters["isAuthenticated"]) {
      return getClassesForSemester(this.$faunaClient(), semesterId).then(
        (classes) => {
          commit("setClasses", classes);
        }
      );
    }
  },
  getAllClasses({ commit, rootGetters }) {
    if (rootGetters["isAuthenticated"]) {
      return getAllClasses(this.$faunaClient()).then((classes) => {
        commit("setClasses", classes);
      });
    }
  },
  /**
   *
   * @param {*} data expects semester and rest of data
   */
  createClass({ commit, getters, rootGetters, dispatch }, semesterId) {
    const activeSemester =
      semesterId || rootGetters["semesters/getActiveSemester"];
    const classData = {
      credits: null,
      grade: 4,
      name: "",
      comments: "",
      semester: activeSemester.id,
    };
    if (rootGetters["isAuthenticated"]) {
      dispatch("triggerSaving", 1, { root: true });
      addClass(this.$faunaClient(), activeSemester.ref, classData).then(
        (resp) => {
          commit("addClass", resp);
          dispatch("triggerSaving", 2, { root: true });
        }
      );
    } else {
      let latestClasses = [
        ...getters["getClassesForSemester"](activeSemester.id),
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
        id: activeSemester.id + "_" + (latestClassId + 1),
      };
      commit("addClass", newClass);
      dispatch("triggerSaving", null, { root: true });
    }
  },
  deleteClass({ commit, getters, rootGetters, dispatch }, classId) {
    if (rootGetters["isAuthenticated"]) {
      const classRef = getters["getClassById"](classId).ref;
      dispatch("triggerSaving", 1, { root: true });
      deleteClass(this.$faunaClient(), classRef).then(() => {
        commit("deleteClass", classId);
        dispatch("triggerSaving", 2, { root: true });
      });
    } else {
      // Do localStorage
      commit("deleteClass", classId);
      dispatch("triggerSaving", null, { root: true });
    }
  },
  updateClassValue({ commit, rootGetters, dispatch }, data) {
    const toUpdate = getters["getClassById"](data.id);
    const toUpdateData = {
      ...toUpdate,
      ...data,
    };
    if (rootGetters["isAuthenticated"]) {
      dispatch("triggerSaving", 1, { root: true });
      updateClass(this.$faunaClient(), toUpdateData.id, toUpdateData).then(
        (resp) => {
          commit("updateClass", resp);
          dispatch("triggerSaving", 2, { root: true });
        }
      );
    } else {
      // Do localStorage
      commit("updateClass", toUpdateData);
      dispatch("triggerSaving", null, { root: true });
    }
  },
  deleteClassesForSemester({ commit, getters, rootGetters }, semesterId) {
    if (rootGetters["isAuthenticated"]) {
      // We don't need this for db because the DeleteSemesters handles it.
    } else {
      // Do localStorage
      const classes = getters["getClassesForSemester"](semesterId);
      classes.forEach((c) => commit("deleteClass", c.id));
    }
  },
  clearData({ commit }) {
    return commit("deleteAll");
  },
};
export default { state, actions, mutations, getters };
