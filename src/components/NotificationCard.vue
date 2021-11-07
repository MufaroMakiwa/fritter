<template>
  <FollowRequest v-if="isFollowRequest" :request="notification"/>
  <div v-else>Something else</div>
</template>

<script>
import FollowRequest from './FollowRequest';


export default {
  name: "NotificationCard",

  props: {
    notification: Object
  },

  components: {
    FollowRequest
  },

  computed: {
    isFollowRequest() {
      return this.notification.freetId === undefined;
    }
  }
}
</script>

<style scoped>

</style>