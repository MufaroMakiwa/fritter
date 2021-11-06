<template>
  <MainPageTemplate :loading="loading" :displaySidebar="true">
    <h2 class="section-title">Notifications</h2>
    <section v-if="hasRequests" class="follow-requests">
      <FollowRequest 
        v-for="(request, index) in requestsReceived"
        :key="index"
        :request="request"/>
    </section>

    <span v-else>You do not have any notifications</span>
  </MainPageTemplate>
</template>

<script>
import MainPageTemplate from '../components/MainPageTemplate';
import FollowRequest from '../components/FollowRequest';

export default {
  name: "Notifications",

  components: {
    MainPageTemplate, FollowRequest
  },

  data() {
    return {
      loading: true,
    }
  },

  computed: {
    isSignedIn() {
      return this.$store.getters.isSignedIn;
    },

    requestsReceived() {
      return this.isSignedIn ? this.$store.getters.user.requestsReceived : [];
    },

    hasRequests() {
      return this.requestsReceived.length > 0;
    }
  },

  mounted() {
    this.loading = false;
  }
}
</script>

<style scoped>
.follow-requests {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
}
</style>
