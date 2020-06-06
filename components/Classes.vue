<template>
  <div>
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr class="text-center">
            <th>Name</th>
            <th>Credits</th>
            <th>Grade</th>
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
                @blur="editClass($event, cls.id)"
                @keyup.enter="$event.target.blur()"
              />
            </td>
            <td class="text-center">
              <input
                :value="cls.credits"
                class="form-control"
                type="number"
                name="credits"
                @blur="editClass($event, cls.id)"
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
                @change="editClass($event, cls.id)"
              >
                <option
                  v-for="option in gpaScale"
                  :key="cls.id + '_' + option.text"
                  :value="option.value"
                  :selected="parseFloat(option.value) === parseFloat(cls.grade)"
                  >{{ option.text }}</option
                >
              </select>
            </td>
            <td class="text-center">
              <button class="btn btn-danger">
                <i class="far fa-trash" aria-label="Delete"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
    editClass(event, classId) {
      const newValue = event.target.value;
      const changed = event.target.name;
      const updatePackage = {
        id: classId,
      };
      updatePackage[changed] = newValue;
      this.$store.dispatch("classes/updateClassValue", updatePackage);
    },
  },
};
</script>
