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
      // display freet pop up

      patch('/api/user/notifications', {
        updatedStatus: "OPENED",
        likeIds: [ this.notification.likeDetails.likeId ]
      });
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
