<template>
  <MainPageTemplate :loading="loading" :displaySidebar="true">
    <h2 class="section-title">Notifications</h2>
    <section v-if="hasNotifications" class="follow-requests">
      <NotificationCard 
        v-for="(notification, index) in notifications"
        :key="index"
        :notification="notification"/>
    </section>

    <span v-else>You do not have any notifications</span>
  </MainPageTemplate>
</template>

<script>
import MainPageTemplate from '../components/MainPageTemplate';
import NotificationCard from '../components/NotificationCard';
import { patch } from '../utils/crud-helpers';

export default {
  name: "Notifications",

  components: {
    MainPageTemplate, NotificationCard
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

    notifications() {
      return this.isSignedIn ? this.$store.getters.user.notifications : [];
    },

    hasNotifications() {
      return this.notifications.length > 0;
    }
  },

  created() {
    // update all like and refreet notifications as seen
    // patch('/api/user/notifications')
    //   .then(response => {
    //     if (response.isSuccess) {
    //       this.$store.dispatch('updateNotifications', response.data.notifications);
    //       this.loading = false;
    //     } else {
    //       // the only expected error is when the user is not logged in which is
    //       // handled in App.vue
    //     }
    //   });
    this.loading = false;
  },
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
