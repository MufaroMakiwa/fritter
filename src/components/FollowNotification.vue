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

 
export default {
  name: "FollowNotification",

  props: {
    notification: Object
  },

  components: {
    NotificationTemplate
  },

  methods: {
    goToProfile() {
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
