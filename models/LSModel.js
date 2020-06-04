"use strict";

/**
 * LocalStorage database
 * key: gpa_ls_schools
 * [
 *    {
 *        id: int,
 *        name: string,
 *        gpa_type: int
 *    },
 *    ...
 * ]
 * key: gpa_ls_semesters
 * [
 *    {
 *        id: int,
 *        school_id: int,
 *        name: string
 *    },
 *    ...
 * ]
 * key: gpa_ls_classes
 * [
 *    {
 *        id: int,
 *        semester_id: int,
 *        name: string,
 *        credits: int,
 *        grade: float,
 *        comments: string
 *    },
 *    ...
 * ]
 */

const KEY_SCHOOL = "gpa_ls_schools";
const KEY_SEMESTER = "gpa_ls_semesters";
const KEY_CLASS = "gpa_ls_classes";

function getData(key) {
  const ls = localStorage || window.localStorage;
  if (ls) {
    const data = ls.getItem(key);
    return JSON.parse(data);
  } else {
    return false;
  }
}

function updateData(key, data) {
  const ls = localStorage || window.localStorage;
  if (ls) {
    ls.setItem(key, JSON.stringify(data));
  }
}

class LSModel {
  constructor() {
    this.schools = [];
    this.semesters = [];
    this.classes = [];
  }

  /**
   * SCHOOLS
   */
  getLocalSchools() {
    const data = getData(KEY_SCHOOL);
    if (data) {
      this.schools = data;
      return data;
    }
  }
  addLocalSchool(data) {
    const latestId =
      this.getLocalSchools()
        .sort((a, b) => a.id - b.id)
        .pop().id || 0;
    const newSchool = {
      id: latestId + 1,
      ...data,
    };
    this.schools.push(newSchool);
    updateData(KEY_SCHOOL, this.schools);
    return newSchool;
  }
  updateLocalSchool(schoolId, newData) {
    const toUpdateIdx = this.schools.findIndex((sm) => sm.id === schoolId);
    let toUpdate = this.schools[toUpdateIdx];
    toUpdate = {
      ...toUpdate,
      ...newData,
    };
    this.schools.splice(toUpdateIdx, 1, toUpdate);
    updateData(KEY_SCHOOL, this.schools);
    return toUpdate;
  }
  deleteLocalSchool(schoolId) {
    const toDeleteIdx = this.schools.findIndex((sm) => sm.id === schoolId);
    this.schools.splice(toDeleteIdx, 1);
    updateData(KEY_SCHOOL, this.schools);
  }

  /**
   * SEMESTERS
   */
  getLocalSemesters(schoolId) {
    const data = getData(KEY_SEMESTER);
    if (data) {
      this.semesters = data;
      const newData = data.filter((semester) => {
        return semester.school_id === schoolId;
      });
      return newData;
    }
  }
  addLocalSemester(schoolId, data) {
    const latestId =
      this.getLocalSemesters(schoolId)
        .sort((a, b) => a.id - b.id)
        .pop().id || 0;
    const newSemester = {
      id: latestId + 1,
      ...data,
    };
    this.semesters.push(newSemester);
    updateData(KEY_SEMESTER, this.semesters);
    return newSemester;
  }
  updateLocalSemester(semesterId, newData) {
    const toUpdateIdx = this.semesters.findIndex((sm) => sm.id === semesterId);
    let toUpdate = this.semesters[toUpdateIdx];
    toUpdate = {
      ...toUpdate,
      ...newData,
    };
    this.semesters.splice(toUpdateIdx, 1, toUpdate);
    updateData(KEY_SEMESTER, this.semesters);
    return toUpdate;
  }
  deleteLocalSemester(semesterId) {
    const toDeleteIdx = this.semesters.findIndex((sm) => sm.id === semesterId);
    this.semesters.splice(toDeleteIdx, 1);
    updateData(KEY_SEMESTER, this.semesters);
  }

  /**
   * CLASSES
   */
  getLocalClasses(semester_id) {
    const data = getData(KEY_CLASS);
    if (data) {
      this.classes = data;
      return data.filter((cls) => {
        return cls.semester_id === semester_id;
      });
    }
  }
  addLocalClass(semesterId, data) {
    const latestClassId =
      this.getLocalClasses(semesterId)
        .sort((a, b) => a.id - b.id)
        .pop().id || 0;
    const newClass = {
      id: latestClassId + 1,
      ...data,
    };
    this.classes.push(newClass);
    updateData(KEY_CLASS, this.classes);
    return newClass;
  }
  updateLocalClass(classId, newData) {
    const toUpdateIdx = this.classes.findIndex((c) => c.id === classId);
    let toUpdate = this.classes[toUpdateIdx];
    toUpdate = {
      ...toUpdate,
      ...newData,
    };
    this.classes.splice(toUpdateIdx, 1, toUpdate);
    updateData(KEY_CLASS, this.classes);
    return toUpdate;
  }
  deleteLocalClass(classId) {
    const toDeleteIdx = this.classes.findIndex((c) => c.id === classId);
    this.classes.splice(toDeleteIdx, 1);
    updateData(KEY_CLASS, this.classes);
  }
}

export default new LSModel();
