import { addSemester, getSemesters } from "~/models/Semesters";
import LSModel from "~/models/LSModel";

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
  getSemestersForSchool({ commit, getters }, schoolID) {
    if (getters["isAuthenticated"]) {
      getSemesters(schoolID).then((semesters) => {
        commit("setSemesters", semesters);
      });
    } else {
      // Do localStorage
      commit("setSchools", LSModel.getLocalSemesters(schoolID));
    }
  },
  /**
   *
   * @param {*} data expects schoolID and semesterData
   */
  createSemester({ commit, getters }, data) {
    if (getters["isAuthenticated"]) {
      addSemester(data.schoolID, data.semesterData).then((resp) => {
        commit("addSemester", resp);
      });
    } else {
      // Do localStorage
      commit(
        "addSemester",
        LSModel.addLocalSemester(data.schoolID, data.semesterData)
      );
    }
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
