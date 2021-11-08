<template>
  <FollowRequest v-if="isFollowRequest" :request="notification"/>
  <FollowNotification v-else-if="isActiveRelation" :notification="notification"/>
  <LikeNotification v-else-if="isLike" :notification="notification"/>
  <RefreetNotification v-else-if="isRefreet" :notification="notification"/>
</template>

<script>
import FollowRequest from './FollowRequest';
import FollowNotification from './FollowNotification';
import LikeNotification from './LikeNotification';
import RefreetNotification from './RefreetNotification';


export default {
  name: "NotificationCard",

  props: {
    notification: Object
  },

  components: {
    FollowRequest, FollowNotification, LikeNotification, RefreetNotification
  },

  computed: {
    isFollowRequest() {
      return this.notification.relationStatus !== undefined 
          && this.notification.relationStatus === "PENDING";
    },

    isActiveRelation() {
      return this.notification.relationStatus !== undefined
          && this.notification.relationStatus === "ACTIVE";
    },

    isLike() {
      return this.notification.likeDetails !== undefined;
    },

    isRefreet() {
      return this.notification.refreetDetails !== undefined;
    }
  }
}
</script>
