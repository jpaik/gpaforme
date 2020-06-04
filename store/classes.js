import { addClass, getClasses } from "~/models/Classes";
import LSModel from "~/models/LSModel";

export const state = () => ({ classes: [] });
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
  getClassesForSemester({ commit, getters }, semesterID) {
    if (getters["isAuthenticated"]) {
      getClasses(semesterID).then((classes) => {
        commit("setClasses", classes);
      });
    } else {
      // Do localStorage
      commit("setClasses", LSModel.getLocalClasses(semesterID));
    }
  },
  /**
   *
   * @param {*} data expects semesterID and classData
   */
  createClass({ commit, getters }, data) {
    if (getters["isAuthenticated"]) {
      addClass(data.semesterID, data.classData).then((resp) => {
        commit("addClass", resp);
      });
    } else {
      commit(
        "addClass",
        LSModel.addLocalClass(data.semesterID, data.classData)
      );
    }
  },
};
export default { state, actions, mutations, getters };
