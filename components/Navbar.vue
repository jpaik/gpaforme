<template>
  <b-navbar toggleable="lg" type="light" variant="light" fixed="top">
    <a class="navbar-brand" href="/">GPA For Me</a>

    <b-navbar-toggle target="main-menu"></b-navbar-toggle>
    <b-collapse id="main-menu" is-nav>
      <b-navbar-nav class="ml-auto">
        <template v-if="isAuthenticated">
          <b-nav-item-dropdown right>
            <template v-slot:button-content>
              <strong>{{ loggedInUser.username }}</strong>
            </template>
            <b-dropdown-item to="/settings">Settings</b-dropdown-item>
          </b-nav-item-dropdown>
        </template>
        <template v-else>
          <b-nav-item @click="login">
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
  },
};
</script>
