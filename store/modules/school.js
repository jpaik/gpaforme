import { createSchool, getSchools } from "~/models/School";
//   deleteSchool,
//   updateSchoolName,
//   updateSchoolGPAType,

export const state = () => ({
  schools: [
    {
      id: "default",
      name: "school",
      type: 1,
    },
  ],
});
export const getters = {
  getSchools(state) {
    return state.schools;
  },
};
export const mutations = {
  addSchool(state, school) {
    state.school.push(school);
  },
  setSchools(state, schools) {
    state.schools = schools;
  },
};
export const actions = {
  getAllSchools({ commit }) {
    getSchools.then((schools) => {
      commit("setSchools", schools);
    });
  },
  createSchool({ commit }, data) {
    createSchool(data).then((resp) => {
      commit("addSchool", resp);
    });
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
