<template>
  <div>
    <h1>GPA For Me</h1>
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
  mounted() {},
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
