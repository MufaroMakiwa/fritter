<template>
  <NotificationTemplate 
    @notification-click="goToProfile"
    :notificationClass="notificationClass"
    :username="notification.username"
    :dateAdded="notification.dateAdded"
    :message="message"
    iconClass="follow"
    icon="user-friends"/>
</template>

<script>
import { eventBus } from '../main';
import NotificationTemplate from './NotificationTemplate';
import { patch } from '../utils/crud-helpers';

 
export default {
  name: "FollowNotification",

  props: {
    notification: Object,
    index: Number,
  },

  components: {
    NotificationTemplate
  },

  methods: {
    async goToProfile() {
      // update store
      this.$store.dispatch('updateNotificationStatus', {
        index: this.index,
        notification: {
          ...this.notification,
          notificationStatus: "OPENED"
        }
      });

      // update the backend
      await patch('/api/user/notifications', {
        updatedStatus: "OPENED",
        ...this.notification.isAcceptedRequest && { acceptedRequestIds: [ this.notification.relationId ] },
        ...!this.notification.isAcceptedRequest && { newFollowerIds: [ this.notification.relationId ] },
      });

      eventBus.$emit('navigate-to-profile', this.notification.username);
    }
  },

  computed: {
    message() {
      return this.notification.isAcceptedRequest
              ? "accepted your follow request."
              : "is now following you.";
    },

    notificationClass() {
      return this.notification.notificationStatus.toLowerCase();
    }
  }

}
</script>
