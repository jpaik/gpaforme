<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-8 order-md-2 mb-4">
        <div v-if="activeSchool" class="row justify-content-center mb-3">
          <div class="col-12 col-md-6">
            <h2 class="text-center">
              <span>Semester GPA: {{ getSemesterGPA }}</span>
            </h2>
          </div>
          <div v-if="getCumulativeGPA" class="col-12 col-md-6">
            <h2 class="text-center">
              <span>Cumulative GPA: {{ getCumulativeGPA }}</span>
            </h2>
          </div>
        </div>
        <Classes :active-school="activeSchool" />
      </div>

      <div class="col-12 col-md-2 order-md-1 mb-4">
        <Semesters :active-school="activeSchool" />
      </div>

      <div class="col-12 col-md-2 order-md-3 mb-4">
        <GPAScale />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Semesters from "~/components/Semesters";
import Classes from "~/components/Classes";
import GPAScale from "~/components/GPA";
export default {
  components: {
    Semesters,
    GPAScale,
    Classes,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      "isAuthenticated",
      "loggedInUser",
      "getSemesterGPA",
      "getCumulativeGPA",
    ]),
    ...mapGetters({
      schools: "schools/getSchools",
      activeSchool: "schools/getActiveSchool",
    }),
  },
  mounted() {
    this.$nextTick(() => {});
  },
  methods: {},
};
</script>
