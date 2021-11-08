<template>
  <NotificationTemplate 
    @notification-click="displayFreet"
    :notificationClass="notificationClass"
    :username="notification.refreetDetails.refreetedBy"
    :dateAdded="notification.refreetDetails.dateAdded"
    :message="message"
    iconClass="refreet"
    icon="retweet">

    <template v-slot:content>
      <p class="notification-card-content">{{ notification.content }}</p>
    </template>

  </NotificationTemplate>
</template>

<script>
import NotificationTemplate from './NotificationTemplate';

 
export default {
  name: "RefreetNotification",

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
      return "refreeted one of your freets.";
    },

    notificationClass() {
      return this.notification.refreetDetails.notificationStatus.toLowerCase();
    }
  }

}
</script>
