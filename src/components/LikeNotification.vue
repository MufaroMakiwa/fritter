<template>
  <NotificationTemplate 
    @notification-click="displayFreet"
    :notificationClass="notificationClass"
    :username="notification.likeDetails.likedBy"
    :dateAdded="notification.likeDetails.dateAdded"
    :message="message"
    iconClass="like"
    icon="heart">

    <template v-slot:content>
      <p class="notification-card-content">{{ notification.content }}</p>
    </template>
    
  </NotificationTemplate>
</template>

<script>
import NotificationTemplate from './NotificationTemplate';

 
export default {
  name: "LikeNotifications",

  props: {
    notification: Object
  },

  components: {
    NotificationTemplate
  },

  methods: {
    displayFreet() {
      alert("TODO");
    }
  },

  computed: {
    message() {
      return "liked one of your freets.";
    },

    notificationClass() {
      return this.notification.likeDetails.notificationStatus.toLowerCase();
    }
  }

}
</script>
