<template>
  <MainPageTemplate :loading="loading">
    <section class="error-section">
      <span>Oops! The page could not be found.</span>
      <button class="not-found-button" @click="goToHome">GO TO HOMEPAGE</button>
    </section>
    
  </MainPageTemplate>
</template>

<script>
import MainPageTemplate from '../components/MainPageTemplate';

export default {
  name: "NotFound",

  data() {
    return {
      loading: true,
    }
  },

  components: {
    MainPageTemplate
  },

  mounted() {
    this.loading = false
  },

  methods: {
    goToHome() {
      this.$router.push({ name: "Home" });
    }
  }
}
</script>

<style scoped>
.not-found-button {
  margin-left: 0;
  margin-top: 3rem;
}

.error-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>