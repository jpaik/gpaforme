import { addSemester, getSemesters } from "~/models/Semesters";

export const state = () => ({
  semesters: [],
});
export const getters = {
  getSemesters: (state) => state.semesters,
  getSemestersForSchool: (state) => (schoolId) =>
    state.semesters.filter((s) => s.school === schoolId),
  getSemesterById: (state) => (id) => state.semesters.find((s) => s.id === id),
  getActiveSemester: (state) => state.semesters.find((s) => s.active),
};
export const mutations = {
  addSemester(state, newSemester) {
    state.semesters.push(newSemester);
  },
  setSemesters(state, semesters) {
    state.semesters = semesters;
  },
  updateSemester(state, newData) {
    const idx = state.semesters.findIndex((s) => newData.id === s.id);
    const semester = state.semesters[idx];
    state.semesters.splice(idx, 1, {
      ...semester,
      ...newData,
    });
  },
};
export const actions = {
  getSemestersForSchool({ commit, getters }, schoolId) {
    if (getters["isAuthenticated"]) {
      getSemesters(schoolId).then((semesters) => {
        commit("setSemesters", semesters);
      });
    }
  },
  /**
   *
   * @param {*} data expects school and rest of data
   */
  createSemester({ commit, getters }, data) {
    if (getters["isAuthenticated"]) {
      addSemester(data.school, data).then((resp) => {
        commit("addSemester", resp);
      });
    } else {
      // Do localStorage
      const latestSemesterId = [
        ...getters["getSemestersForSchool"](data.school),
      ]
        .sort((a, b) => a.id.split("_").pop() - b.id.split("_").pop())
        .pop().id || [0];
      const newSemester = {
        ...data,
        id: data.school + "_" + (latestSemesterId.split("_").pop() + 1),
      };
      commit("addSemester", newSemester);
    }
  },
  updateActiveSemester({ commit, getters }, semesterId) {
    const currentSemester = getters["getActiveSemester"];
    const changeCurrentActive = {
      ...currentSemester,
      active: false,
    };
    const newActive = getters["getSemesterById"](semesterId);
    const changeNewActive = {
      ...newActive,
      active: true,
    };
    if (getters["isAuthenticated"]) {
      // Change
    } else {
      // Do localStorage
      if (currentSemester) {
        commit("updateSemester", changeCurrentActive);
      }
      commit("updateSemester", changeNewActive);
    }
  },
  updateSemesterName({ commit, getters }, { semesterId, newName }) {
    const toUpdate = getters["getSemesterById"](semesterId);
    const toUpdateData = {
      ...toUpdate,
      name: newName,
    };
    if (getters["isAuthenticated"]) {
      // Change
    } else {
      // Do localStorage
      commit("updateSemester", toUpdateData);
    }
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
