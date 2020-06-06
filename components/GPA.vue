<template>
  <div>
    <h4 class="text-center">GPA Model</h4>
    <div class="text-center pb-3">
      <select
        class="form-control w-auto d-inline-block"
        @change="changeGPAType($event)"
      >
        <option
          v-for="option in getGPATypes"
          :key="option.value"
          :value="option.value"
          :selected="currentScale === option.value"
          >{{ option.text }}</option
        >
      </select>
    </div>
    <div class="table-responsive">
      <table class="table table-hover table-bordered table-sm">
        <thead>
          <tr class="text-center">
            <th>Grade</th>
            <th>{{ currentScale === "hs" ? "Acd." : "Points" }}</th>
            <th v-if="currentScale === 'hs'">Hnr.</th>
            <th v-if="currentScale === 'hs'">A.P.</th>
          </tr>
        </thead>
        <tbody class="text-center">
          <tr v-for="gpa in gpaScale" :key="gpa.text">
            <td>{{ gpa.text }}</td>
            <td>{{ gpa.value }}</td>
            <td v-if="currentScale === 'hs'">
              {{ gpa.value ? gpa.value + 0.5 : 0 }}
            </td>
            <td v-if="currentScale === 'hs'">
              {{ gpa.value ? gpa.value + 1.0 : 0 }}
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
  computed: {
    ...mapGetters(["getGPATypes", "getGPALevels"]),
    ...mapGetters({
      gpas: "getGPAS",
      activeSchool: "schools/getActiveSchool",
    }),
    currentScale() {
      return this.activeSchool ? this.activeSchool.scale : false;
    },
    gpaScale() {
      return this.gpas[this.currentScale];
    },
  },
  methods: {
    changeGPAType(event) {
      const newScale = event.target.value;
      this.$store.dispatch("schools/updateSchoolScale", newScale);
    },
  },
};
</script>
