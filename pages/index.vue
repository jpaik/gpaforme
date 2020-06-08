<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-sm-6 order-sm-2 col-xl-2 order-xl-1 mb-4">
        <Semesters :active-school="activeSchool" />
      </div>

      <div class="col-12 order-sm-1 col-xl-8 order-xl-2 mb-4">
        <div v-if="activeSchool" class="row justify-content-center mb-3">
          <div class="col-6">
            <h2 class="text-center mobile-sm">
              <strong>Semester GPA: {{ getSemesterGPA }}</strong>
            </h2>
          </div>
          <div v-if="getCumulativeGPA" class="col-6">
            <h2 class="text-center mobile-sm">
              <strong>Cumulative GPA: {{ getCumulativeGPA }}</strong>
            </h2>
          </div>
        </div>
        <Classes :active-school="activeSchool" />

        <div class="row justify-content-center mt-4">
          <div class="col-6 col-sm-4 col-lg-2">
            <b-alert
              :show="dataSaved"
              :variant="getSavingClass"
              class="d-flex align-items-center"
            >
              <b-spinner
                v-if="dataSaved === 1"
                type="grow"
                label="Saving..."
                small
                class="mr-3"
              ></b-spinner>
              <span v-else class="mr-3">
                <i class="far fa-check"></i>
              </span>
              {{ getSavingText() }}
            </b-alert>
          </div>
        </div>
      </div>
      <div class="col-12 order-3 col-sm-6 col-xl-2 mb-4">
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
      dataSaved: "getSavingState",
    }),
    getSavingClass() {
      return this.dataSaved === 1 ? "warning" : "success";
    },
  },
  mounted() {
    this.$nextTick(() => {});
  },
  methods: {
    getSavingText() {
      return this.dataSaved === 1 ? "Saving..." : "Saved";
    },
  },
};
</script>
<style scoped lang="scss">
.mobile-sm {
  @media only screen and (max-width: 991px) {
    font-size: 1.5rem;
  }
}
</style>
