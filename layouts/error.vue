<template>
  <div class="container vh-100">
    <div class="row vh-100 justify-content-center align-items-center">
      <div class="col-12 col-md-6">
        <b-card class="text-center" bg-variant="dark" text-variant="white">
          <h1 v-if="error.statusCode === 404">Page Not Found</h1>
          <h1 v-else>An error occurred</h1>
          <nuxt-link to="/">Back to Home</nuxt-link>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["error"],
  layout: "fullpage",
};
</script>
