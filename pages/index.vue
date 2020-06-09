<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-sm-6 order-sm-2 col-xl-2 order-xl-1 mb-4">
        <Semesters :active-school="activeSchool" />
      </div>

      <div class="col-12 order-sm-1 col-xl-8 order-xl-2 mb-4">
        <div
          v-if="activeSchool && activeSemester"
          class="row justify-content-center mb-3"
        >
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
              class="d-flex align-items-center justify-content-center"
            >
              <b-spinner
                v-if="dataSaved === 1"
                type="grow"
                label="Saving..."
                small
                class="mr-2"
              ></b-spinner>
              <span v-else class="mr-2">
                <i class="far fa-check"></i>
              </span>
              <span class="mr-3">{{ getSavingText() }}</span>
            </b-alert>
          </div>
        </div>
      </div>
      <div class="col-12 order-3 col-sm-6 col-xl-2 mb-4">
        <GPAScale />
      </div>

      <b-overlay :show="isMigrating" no-wrap>
        <template v-slot:overlay>
          <div class="d-flex flex-column align-items-center">
            <b-spinner variant="primary" label="Migrating..."></b-spinner>
            <h3 class="mt-3">Migrating local data to the cloud database.</h3>
            <p>Please wait...</p>
            <span class="sr-only">Please wait...</span>
          </div>
        </template>
      </b-overlay>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Semesters from "~/components/Semesters";
import Classes from "~/components/Classes";
import GPAScale from "~/components/GPA";
import { checkLocalStorage } from "~/plugins/faunaMigration";
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
      activeSemester: "semesters/getActiveSemester",
      dataSaved: "getSavingState",
      isMigrating: "getMigratingState",
    }),
    getSavingClass() {
      return this.dataSaved === 1 ? "warning" : "success";
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.isAuthenticated) {
        // If user is logged in and;
        const hasSchool = this.schools.length;
        // If school doesn't exist (then empty DB and localStorage exists, then migrate to Faunadb)
        if (!hasSchool && checkLocalStorage()) {
          this.$migrateToFauna();
        }
      }
    });
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
