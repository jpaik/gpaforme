<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-8 order-md-2">
        <h2 class="text-center mb-3">
          <span>Semester GPA:</span>
        </h2>
        <div class="table-responsive">
          <table class="table table-hover table-bordered table-light">
            <thead>
              <tr class="text-center">
                <th>Name</th>
                <th>Credits</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cls in classes" :key="cls.id">
                <td>
                  <input :value="cls.name" class="text" />
                </td>
                <td>
                  <input :value="cls.credits" class="text" />
                </td>
                <td>
                  <select :value="cls.grade">
                    <option
                      v-for="option in gpaScale"
                      :key="option"
                      :value="option.value"
                      >{{ option.text }}</option
                    >
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="col-12 col-md-2 order-md-1">
        <h4 class="text-center">Semesters</h4>
      </div>

      <div class="col-12 col-md-2 order-md-3">
        <h4 class="text-center">GPA Model</h4>
        <div class="text-center pb-3">
          <select @change="changeGPAType($event)">
            <option
              v-for="option in getGPATypes"
              :key="option.value"
              :value="option.value"
              :selected="schools[0].scale === option.value"
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
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      "isAuthenticated",
      "loggedInUser",
      "getGPATypes",
      "getGPALevels",
    ]),
    ...mapGetters({
      gpas: "getGPAS",
      schools: "schools/getSchools",
      semesters: "semesters/getSemesters",
      classes: "classes/getClasses",
    }),
    currentScale() {
      return this.schools[0].scale;
    },
    gpaScale() {
      return this.gpas[this.currentScale];
    },
  },
  mounted() {
    this.$nextTick(() => {});
  },
  methods: {
    changeGPAType(event) {
      const newScale = event.target.value;
      this.$store.dispatch("schools/updateSchoolScale", newScale);
    },
    toDecimal(val) {
      if (val && typeof val === "number") {
        if (Number.isInteger(val)) {
          return val;
        }
        return val.toFixed(2);
      }
      return val;
    },
  },
};
</script>
