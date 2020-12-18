<template>
  <div>
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr class="text-center">
            <th>Name</th>
            <th>Credits</th>
            <th>Grade</th>
            <th v-if="currentScale === 'hs'">Level</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cls in classes" :key="cls.id">
            <td class="text-center">
              <input
                :value="cls.name"
                class="form-control"
                type="text"
                name="name"
                aria-label="edit class name"
                @blur="editClass($event, cls.id, cls.name)"
                @keyup.enter="$event.target.blur()"
              />
            </td>
            <td class="text-center">
              <input
                :value="cls.credits"
                class="form-control"
                type="number"
                name="credits"
                aria-label="edit credits"
                @blur="editClass($event, cls.id, cls.credits)"
                @keyup.enter="$event.target.blur()"
              />
            </td>
            <td class="text-center">
              <select
                :value="cls.grade"
                name="grade"
                :class="{
                  'form-control w-auto d-inline-block': true,
                }"
                aria-label="select a grade"
                @change="editClass($event, cls.id, cls.grade)"
              >
                <option
                  v-for="option in gpaScale"
                  :key="cls.id + '_' + option.text"
                  :value="option.value"
                  :selected="parseFloat(option.value) === parseFloat(cls.grade)"
                  >{{ option.text }}</option
                >
                <option
                  v-if="currentScale !== 'hs'"
                  value="P"
                  :selected="parseFloat(cls.grade) === 'P'"
                  >P</option
                >
              </select>
            </td>
            <td v-if="currentScale === 'hs'" class="text-center">
              <select
                :value="cls.level"
                name="level"
                :class="{
                  'form-control w-auto d-inline-block': true,
                }"
                aria-label="select highschool level"
                @change="editClass($event, cls.id, cls.level)"
              >
                <option
                  v-for="option in getGPALevels"
                  :key="cls.id + '_' + option.value"
                  :value="option.value"
                  :selected="parseInt(option.value) === parseInt(cls.level)"
                  >{{ option.text }}</option
                >
              </select>
            </td>
            <td class="text-center">
              <button
                class="btn btn-danger"
                type="button"
                aria-label="Delete Class"
                @click.stop.prevent="deleteClass(cls.id)"
              >
                <i class="far fa-trash" aria-label="trashcan"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row justify-content-center">
      <div class="col-12 col-sm-6 col-lg-3">
        <button
          class="btn btn-outline-success w-100"
          type="button"
          aria-label="Add Class"
          @click.stop.prevent="addClass()"
        >
          <i class="far fa-plus" aria-label="plus sign"></i> Add Class
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: ["activeSchool"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getGPATypes", "getGPALevels"]),
    ...mapGetters({
      gpas: "getGPAS",
      activeSemester: "semesters/getActiveSemester",
    }),
    classes() {
      return this.activeSemester
        ? this.$store.getters["classes/getClassesForSemester"](
            this.activeSemester.id
          )
        : [];
    },
    currentScale() {
      return this.activeSchool ? this.activeSchool.scale : false;
    },
    gpaScale() {
      return this.gpas[this.currentScale];
    },
  },
  methods: {
    editClass(event, classId, oldValue) {
      const newValue = event.target.value;
      const changed = event.target.name;
      if (oldValue !== newValue) {
        const updatePackage = {
          id: classId,
        };
        updatePackage[changed] = newValue;
        this.$store.dispatch("classes/updateClassValue", updatePackage);
      }
    },
    addClass() {
      this.$store.dispatch("classes/createClass");
    },
    deleteClass(classId) {
      this.$store.dispatch("classes/deleteClass", classId);
    },
  },
};
</script>

<style scoped lang="scss">
@media only screen and (max-width: 991px) {
  table.table {
    font-size: 0.8rem;
    th,
    td {
      padding: 0.5rem;
      button {
        font-size: 0.8rem;
        padding: 0.3rem 0.45rem;
      }
    }
  }
  .form-control {
    font-size: 0.9rem;
    padding: 0.3rem 0.5rem;
  }
}
td {
  > input[name="credits"] {
    display: inline-block;
    max-width: 3rem;
    text-align: center;
  }
  > input[name="name"] {
    display: inline-block;
    min-width: 6rem;
  }
  // Disables browser up/down arrows
  input[type="number"] {
    -moz-appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }
  }
}
</style>
