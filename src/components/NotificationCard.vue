<template>
  <FollowRequest v-if="isFollowRequest" :request="notification" :index="index"/>
  <FollowNotification v-else-if="isActiveRelation" :notification="notification" :index="index"/>
  <LikeNotification v-else-if="isLike" :notification="notification" :index="index"/>
  <RefreetNotification v-else-if="isRefreet" :notification="notification" :index="index"/>
</template>

<script>
import FollowRequest from './FollowRequest';
import FollowNotification from './FollowNotification';
import LikeNotification from './LikeNotification';
import RefreetNotification from './RefreetNotification';


export default {
  name: "NotificationCard",

  props: {
    notification: Object,
    index: Number,
  },

  components: {
    FollowRequest, FollowNotification, LikeNotification, RefreetNotification
  },

  computed: {
    isFollowRequest() {
      return this.notification.relationStatus === "PENDING";
    },

    isActiveRelation() {
      return this.notification.relationStatus === "ACTIVE";
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
