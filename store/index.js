const GPAS = {
  plus: [
    { value: 4, text: "A" },
    { value: 3.5, text: "B+" },
    { value: 3, text: "B" },
    { value: 2.5, text: "C+" },
    { value: 2, text: "C" },
    { value: 1.5, text: "D+" },
    { value: 1, text: "D" },
    { value: 0, text: "F" },
  ],
  minus: [
    { value: 4, text: "A+" },
    { value: 4, text: "A" },
    { value: 3.7, text: "A-" },
    { value: 3.3, text: "B+" },
    { value: 3, text: "B" },
    { value: 2.7, text: "B-" },
    { value: 2.3, text: "C+" },
    { value: 2, text: "C" },
    { value: 1.7, text: "C-" },
    { value: 1.3, text: "D+" },
    { value: 1, text: "D" },
    { value: 0.7, text: "D-" },
    { value: 0, text: "F" },
  ],
  hs: [
    { value: 4.3, text: "A+" },
    { value: 4, text: "A" },
    { value: 3.7, text: "A-" },
    { value: 3.3, text: "B+" },
    { value: 3, text: "B" },
    { value: 2.7, text: "B-" },
    { value: 2.3, text: "C+" },
    { value: 2, text: "C" },
    { value: 1.7, text: "C-" },
    { value: 1.3, text: "D+" },
    { value: 1, text: "D" },
    { value: 0.7, text: "D-" },
    { value: 0, text: "F" },
  ],
};

const GPA_TYPES = [
  { value: "plus", text: "4.0 Scale (+)" },
  { value: "minus", text: "4.0 Scale (+/-)" },
  { value: "hs", text: "High School Scale" },
];
const GPA_LEVELS = [
  // For Highschool Levels
  { value: 1, text: "Academic" },
  { value: 2, text: "Honors" },
  { value: 3, text: "A.P." },
];

const getHighschoolGrade = (grade, level) => {
  if (grade === 0) return 0;
  switch (parseInt(level)) {
    case 2: // Honors
      return grade + 0.5;
    case 3: // A.P.
      return grade + 1;
    default:
      return grade;
  }
};

export const state = () => ({
  GPAS,
  GPA_TYPES,
  GPA_LEVELS,
  saving_state: 0,
  migrating_data: false,
});
export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn;
  },
  loggedInUser(state) {
    return state.auth.user;
  },
  getSavingState(state) {
    return state.saving_state;
  },
  getMigratingState(state) {
    return state.migrating_data;
  },
  faunaKey(state) {
    console.log(process.env.FAUNA_LOCAL_TOKEN);
    console.log(state.auth.user);
    return state.auth.user
      ? state.auth.user[process.env.FAUNA_LOCAL_TOKEN + "fauna_token"]
      : null;
  },
  getGPAS(state) {
    return state.GPAS;
  },
  getGPATypes(state) {
    return state.GPA_TYPES;
  },
  getGPALevels(state) {
    return state.GPA_LEVELS;
  },
  getSemesterGPA(state, getters, rootState, rootGetters) {
    const activeSchool = rootGetters["schools/getActiveSchool"];
    const activeSemester = rootGetters["semesters/getActiveSemester"];
    const classes = rootGetters["classes/getClassesForSemester"](
      activeSemester.id
    );
    let totalCredits = 0;
    let earnedGrades = 0;
    classes.forEach((c) => {
      if (c.credits && c.grade && !isNaN(c.credits) && !isNaN(c.grade)) {
        totalCredits += parseFloat(c.credits);
        earnedGrades +=
          (activeSchool.scale === "hs"
            ? getHighschoolGrade(parseFloat(c.grade), c.level)
            : parseFloat(c.grade)) * parseFloat(c.credits);
      }
    }, 0);
    return totalCredits ? (earnedGrades / totalCredits).toFixed(3) : "N/A";
  },
  getCumulativeGPA(state, getters, rootState, rootGetters) {
    const activeSchool = rootGetters["schools/getActiveSchool"];
    const semesters = rootGetters["semesters/getSemestersForSchool"](
      activeSchool.id
    );
    if (semesters.length < 2) {
      return false;
    }
    const classes = rootGetters["classes/getClasses"];
    let totalCredits = 0;
    let earnedGrades = 0;
    classes
      .filter((c) =>
        semesters.some((s) => {
          return getters["isAuthenticated"]
            ? s.id === c.semester.value.id
            : s.id === c.semester;
        })
      )
      .forEach((c) => {
        if (c.credits && c.grade && !isNaN(c.credits) && !isNaN(c.grade)) {
          totalCredits += parseFloat(c.credits);
          earnedGrades +=
            (activeSchool.scale === "hs"
              ? getHighschoolGrade(parseFloat(c.grade), c.level)
              : parseFloat(c.grade)) * parseFloat(c.credits);
        }
      }, 0);
    return (earnedGrades / totalCredits).toFixed(3);
  },
};
export const mutations = {
  changeSaving(state, val) {
    state.saving_state = val;
  },
  changeMigrating(state, val) {
    state.migrating_data = val;
  },
};
export const actions = {
  triggerSaving({ commit }, value = null) {
    // 1 === loading, 2 === saved, 3 === hidden
    if (value !== null) {
      if (value === 1) {
        commit("changeSaving", value);
      } else {
        commit("changeSaving", value);
        setTimeout(() => {
          commit("changeSaving", 0);
        }, 700);
      }
    } else {
      commit("changeSaving", 1);
      setTimeout(() => {
        commit("changeSaving", 2);
      }, Math.random() * 200 + 200);
      setTimeout(() => {
        commit("changeSaving", 0);
      }, Math.random() * 200 + 900);
    }
  },
  logout({ dispatch }) {
    dispatch("schools/clearData", null, { root: true });
    dispatch("semesters/clearData", null, { root: true });
    dispatch("classes/clearData", null, { root: true });
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
