<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-8 order-md-2">
        <h2 class="text-center mb-3">
          <span>Semester GPA:</span>
        </h2>
        <Classes :active-school="activeSchool" />
      </div>

      <div class="col-12 col-md-2 order-md-1">
        <Semesters :active-school="activeSchool" />
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
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
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
