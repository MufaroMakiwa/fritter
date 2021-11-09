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
import { patch } from '../utils/crud-helpers';


 
export default {
  name: "RefreetNotification",

  props: {
    notification: Object,
    index: Number
  },

  components: {
    NotificationTemplate
  },

  computed: {
    message() {
      return "refreeted one of your freets.";
    },

    notificationClass() {
      return this.notification.refreetDetails.notificationStatus.toLowerCase();
    },

    username() {
      const user = this.$store.getters.user;
      return user !== null ? user.username : '';
    },

    isSignedIn() {
      return this.$store.getters.isSignedIn;
    },
  },

  methods: {
    displayFreet() {
      // update the store
      const updatedRefreetDetails = {
        ...this.notification.refreetDetails,
        notificationStatus: "OPENED"
      };
       
      this.$store.dispatch('updateNotificationStatus', {
        index: this.index,
        notification: {
          ...this.notification,
          refreetDetails: updatedRefreetDetails
        }     
      })

      patch('/api/user/notifications', {
        updatedStatus: "OPENED",
        refreetIds: [ this.notification.refreetDetails.refreetId ]
      });

      if (!this.isSignedIn) return;

      // go to profile page
      this.$router.push({ 
        name: "Profile",
        params: { author: this.username }
      });
    }
  }
}
</script>
