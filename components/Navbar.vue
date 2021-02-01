<template>
  <b-navbar toggleable="lg" type="light" variant="light" fixed="top">
    <a class="navbar-brand" href="/">
      <img
        src="/logo.svg"
        class="img-fluid d-inline-block align-top"
        alt="Gpa For Me Logo - graduation cap with calculator"
      />
      GPA For Me
    </a>

    <b-navbar-toggle target="main-menu"></b-navbar-toggle>
    <b-collapse id="main-menu" is-nav>
      <b-navbar-nav class="ml-auto align-items-center">
        <b-nav-item
          class="w-100 order-2"
          href="https://ko-fi.com/jpaik"
          target="_blank"
        >
          <b-button variant="primary" class="text-nowrap w-100">
            <span class="fa-stack supportme">
              <i class="fas fa-coffee fa-stack-2x" alt="coffee"></i>
              <i class="fas fa-heart fa-stack-1x" alt="heart"></i>
            </span>
            Buy Me a Coffee</b-button
          >
        </b-nav-item>
        <template v-if="isAuthenticated">
          <b-nav-text class="mx-3 text-nowrap order-1">
            Welcome, {{ loggedInUser.name }}
          </b-nav-text>
          <b-nav-item class="w-100 order-3" @click="logout">
            <b-button variant="outline-dark font-weight-light w-100"
              >Logout</b-button
            >
          </b-nav-item>
        </template>
        <template v-else>
          <b-nav-item class="w-100 order-3" @click="login">
            <b-button variant="outline-primary font-weight-light w-100"
              >Login</b-button
            >
          </b-nav-item>
        </template>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
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
  methods: {
    login() {
      this.$auth.loginWith("auth0");
    },
    logout() {
      this.$auth.logout().then(() => {
        this.$store.dispatch("logout").then(() => {
          window.location.reload(true);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.supportme {
  font-size: 0.5em;
  margin-right: 0.25em;
  i {
    vertical-align: middle;
  }
  .fa-heart {
    color: tomato;
    top: -1px;
    left: -1px;
  }
}
</style>
