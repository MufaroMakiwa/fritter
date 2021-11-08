<template>
  <MainPageTemplate :loading="loading" :displaySidebar="true">
    <h2 class="section-title">Notifications</h2>
    <section v-if="hasNotifications" class="notifications">
      <NotificationCard 
        v-for="(notification, index) in notifications"
        :key="index"
        :notification="notification"
        :index="index"/>
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
    },

    likeNotifications() {
      return this.notifications.filter(notification => notification.likeDetails !== undefined);
    },

    refreetNotifications() {
      return this.notifications.filter(notification => notification.refreetDetails !== undefined);
    },

    acceptedRequestNotifications() {
      return this.notifications.filter(notification => {
        return notification.relationStatus === "ACTIVE" && notification.isAcceptedRequest;
      })
    },

    followersNotifications() {
      return this.notifications.filter(notification => {
        return notification.relationStatus === "PENDING" || 
              (notification.relationStatus === "ACTIVE" && !notification.isAcceptedRequest)
      })
    }
  },

  created() {
    // update all like and refreet notifications as seen
    const body = {
      updatedStatus: "SEEN",
      likeIds: this.likeNotifications.map(notification => notification.likeDetails.likeId),
      refreetIds: this.refreetNotifications.map(notification => notification.refreetDetails.refreetId),
      acceptedRequestIds: this.acceptedRequestNotifications.map(notification => notification.relationId),
      newFollowerIds: this.followersNotifications.map(notification => notification.relationId)
    };

    patch('/api/user/notifications', body)
      .then(response => {
        if (response.isSuccess) {
          this.loading = false;
        } else {
          // the only expected error is when the user is not logged in which is
          // handled in App.vue
        }
      });
  },
}
</script>

<style scoped>
.notifications {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
}
</style>
