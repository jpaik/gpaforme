/**
 * Old GPA For Me localStorage setup:
 * .getItem("gpatype") = string
 * * 1 = plus
 * * 2 = minus
 * * 3 = hs
 *
 *
 * .getItem("semesters") = Array of semesters
 * * {
 *      name: "",
 *      selected: "", // selected = active
 *      value: 1, // value = id
 *      classes = Array of classes
 *      * {
 *          credit: "1", // credit is string = credits
 *          grade: 4,    // grade is float
 *          name: "",
 *          level?: 2,   // level only exists if hs scale and is an integer
 *      * }
 * * }
 */

export function checkOldLocalStorage() {
  const ls = localStorage || window.localStorage;
  if (ls) {
    const semesters = ls.getItem("semesters")
      ? JSON.parse(ls.getItem("semesters"))
      : null;
    // Make sure that there is a semester array
    if (semesters !== null) {
      const classes = semesters[0].classes;
      if (classes) {
        // If at least one class has credits or name filled in, then it's good.
        return classes.some((c) => c.credit !== "" || c.name !== undefined);
      }
      return false;
    }
    return false;
  }
}

const getGPAType = (type) => {
  switch (parseInt(type)) {
    case 2:
      return "minus";
    case 3:
      return "hs";
    default:
    case 1:
      return "plus";
  }
};

// If it reaches this, then semesters and classes must exist.
// Convert it to a localStorage item called "gpaforme" because Vuex persist takes care of the rest.
export function convertOldToNew() {
  const gpaforme = {
    schools: {
      schools: [],
    },
    semesters: {
      semesters: [],
    },
    classes: {
      classes: [],
    },
  };

  const ls = localStorage || window.localStorage;
  const gpatype = ls.getItem("gpatype") || "1";
  const defaultSchool = {
    id: "default",
    name: "school",
    scale: getGPAType(gpatype),
    active: true,
  };
  gpaforme.schools.schools.push(defaultSchool);
  const semesters = JSON.parse(ls.getItem("semesters"));
  const defaultSemester = {
    id: 0,
    name: "",
    school: "default",
    active: false,
  };
  semesters.forEach((s, idx) => {
    const newSemester = {
      ...defaultSemester,
      name: s.name,
      active: s.selected === "selected",
      id: "default_" + idx,
    };
    gpaforme.semesters.semesters.push(newSemester);
    ls.removeItem("semesters");
    if (s.classes) {
      const classes = s.classes;
      classes.forEach((c, cidx) => {
        const newClass = {
          id: "default_" + idx + "_" + cidx,
          credits: c.credit ? c.credit : null,
          grade: c.grade,
          name: c.name ? c.name : "",
          comments: "",
          semester: "default_" + idx,
        };
        if (c.level) {
          newClass["level"] = c.level;
        }
        gpaforme.classes.classes.push(newClass);
      });
    }
  });
  localStorage.setItem("gpaforme", JSON.stringify(gpaforme));
  localStorage.removeItem("semesters");
  localStorage.removeItem("gpatype");
}
