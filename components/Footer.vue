<template>
  <footer class="footer">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-7">
          <p class="text-center font-weight-normal">
            Save your GPA by
            <a href="#" @click.prevent="login()"
              >creating an account and logging in</a
            >. Otherwise, your data will be saved in your local storage.
          </p>
        </div>
        <div class="col-12 col-md-7">
          <p class="text-center small">
            &copy; <a href="//cosinic.com" class="text-dark">Cosinic</a>
            {{ year }}.
            <a
              href="//github.com/jpaik/gpaforme"
              target="blank"
              class="text-dark"
              >View source code on Github.</a
            >
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
