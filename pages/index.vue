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
            <tbody></tbody>
          </table>
        </div>
      </div>

      <div class="col-12 col-md-2 order-md-1">
        <h4 class="text-center">Semesters</h4>
      </div>

      <div class="col-12 col-md-2 order-md-3">
        <h4 class="text-center">GPA Model</h4>
        <div class="table-responsive">
          <table class="table table-hover table-bordered table-sm">
            <thead>
              <tr class="text-center">
                <th>Grade</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody></tbody>
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
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
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
