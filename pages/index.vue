<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-8 order-md-2">
        <h2 class="text-center mb-3">
          <span>Semester GPA:</span>
        </h2>
        <div class="table-responsive">
          <table class="table table-hover table-bordered">
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
                <td class="text-center">
                  <input :value="cls.name" class="text" />
                </td>
                <td class="text-center">
                  <input :value="cls.credits" class="text" />
                </td>
                <td class="text-center">
                  <select :value="cls.grade">
                    <option
                      v-for="option in gpaScale"
                      :key="cls.id + '_' + option.text"
                      :value="option.value"
                      >{{ option.text }}</option
                    >
                  </select>
                </td>
                <td class="text-center">
                  <button class="btn btn-danger">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="col-12 col-md-2 order-md-1">
        <h4 class="text-center">Semesters</h4>
        <Semesters :school="activeSchool" />
      </div>

      <div class="col-12 col-md-2 order-md-3">
        <GPAScale />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Semesters from "~/components/Semesters";
import GPAScale from "~/components/GPA";
export default {
  components: {
    Semesters,
    GPAScale,
  },
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
      classes: "classes/getClasses",
      activeSchool: "schools/getActiveSchool",
    }),
    currentScale() {
      return this.activeSchool ? this.activeSchool.scale : false;
    },
    gpaScale() {
      return this.gpas[this.currentScale];
    },
  },
  mounted() {
    this.$nextTick(() => {});
  },
  methods: {
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
