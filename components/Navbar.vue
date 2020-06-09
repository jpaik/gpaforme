<template>
  <b-navbar toggleable="lg" type="light" variant="light" fixed="top">
    <a class="navbar-brand" href="/">
      <img src="/logo.svg" class="img-fluid d-inline-block align-top" />
      GPA For Me
    </a>

    <b-navbar-toggle target="main-menu"></b-navbar-toggle>
    <b-collapse id="main-menu" is-nav>
      <b-navbar-nav class="ml-auto align-items-center">
        <template v-if="isAuthenticated">
          <b-nav-text class="mx-3">
            Welcome, {{ loggedInUser.name }}
          </b-nav-text>
          <b-nav-item class="w-100" @click="logout">
            <b-button variant="outline-dark font-weight-light w-100"
              >Logout</b-button
            >
          </b-nav-item>
        </template>
        <template v-else>
          <b-nav-item class="w-100" @click="login">
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
