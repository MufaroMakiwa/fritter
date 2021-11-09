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
import { patch } from '../utils/crud-helpers';

 
export default {
  name: "LikeNotifications",

  props: {
    notification: Object,
    index: Number
  },

   computed: {
    username() {
      const user = this.$store.getters.user;
      return user !== null ? user.username : '';
    },

    isSignedIn() {
      return this.$store.getters.isSignedIn;
    },

    message() {
      return "liked one of your freets.";
    },

    notificationClass() {
      return this.notification.likeDetails.notificationStatus.toLowerCase();
    }
  },

  components: {
    NotificationTemplate
  },

  methods: {
    displayFreet() {
      // update the store
      const updatedLikeDetails = {
        ...this.notification.likeDetails,
        notificationStatus: "OPENED"
      };
       
      this.$store.dispatch('updateNotificationStatus', {
        index: this.index,
        notification: {
          ...this.notification,
          likeDetails: updatedLikeDetails
        }     
      })

      patch('/api/user/notifications', {
        updatedStatus: "OPENED",
        likeIds: [ this.notification.likeDetails.likeId ]
      });

      if (!this.isSignedIn) return;

      // go to profile page
      this.$router.push({ 
        name: "Profile",
        params: { author: this.username }
      });
    }
  },
}
</script>
