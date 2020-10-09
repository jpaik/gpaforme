<template>
  <footer class="footer">
    <div class="container">
      <div class="row justify-content-center">
        <div v-if="!$auth.loggedIn" class="col-12 col-xl-7">
          <p class="text-center font-weight-normal">
            Save and access your GPA anywhere by
            <a href="#" @click.prevent="login()"
              >creating an account and logging in</a
            >.<br />Otherwise, your data will be saved in your local storage.
          </p>
        </div>
        <div class="col-12 col-xl-7">
          <p class="text-center small mb-1">
            &copy; <a href="//cosinic.com" class="text-dark">Cosinic</a>
            {{ year }}.
            <a
              href="//github.com/jpaik/gpaforme"
              target="blank"
              class="text-dark"
              >View source code on Github.</a
            >
          </p>
          <p class="text-center text-muted small">
            Made with
            <span class="text-danger" aria-label="love">&hearts;</span> by a
            former Rutgers University student.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  computed: {
    year() {
      return new Date().getFullYear();
    },
  },
  methods: {
    login() {
      this.$auth.loginWith("auth0");
    },
  },
};
</script>
