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

export const state = () => ({
  GPAS,
  GPA_TYPES,
  GPA_LEVELS,
});
export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn;
  },
  loggedInUser(state) {
    return state.auth.user;
  },
  faunaKey(state) {
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
    const activeSemester = rootGetters["semesters/getActiveSemester"];
    const classes = rootGetters["classes/getClassesForSemester"](
      activeSemester.id
    );
    let totalCredits = 0;
    let earnedGrades = 0;
    classes.forEach((c) => {
      if (c.credits && c.grade && !isNaN(c.credits) && !isNaN(c.grade)) {
        totalCredits += parseFloat(c.credits);
        earnedGrades += parseFloat(c.grade) * parseFloat(c.credits);
      }
    }, 0);
    return totalCredits ? (earnedGrades / totalCredits).toFixed(1) : "N/A";
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
      .filter((c) => semesters.some((s) => s.id === c.semester))
      .forEach((c) => {
        if (c.credits && c.grade && !isNaN(c.credits) && !isNaN(c.grade)) {
          totalCredits += parseFloat(c.credits);
          earnedGrades += parseFloat(c.grade) * parseFloat(c.credits);
        }
      }, 0);
    return (earnedGrades / totalCredits).toFixed(1);
  },
};
export const mutations = {};
export const actions = {};

export default {
  state,
  actions,
  mutations,
  getters,
};
