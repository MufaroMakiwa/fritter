<template>
  <div class="notification-icon-container">
    <font-awesome-icon icon="bell" class="icon"/>
    <span v-if="hasLabel">{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: "NotificationIcon",

  computed: {
    label() {
      return this.notifications > 99 ? "99+" : this.notifications;
    },

    hasLabel() {
      return this.notifications > 0;
    },

    notifications() {
      const notifications = this.$store.getters.user.notifications;
      let count = 0;

      notifications.forEach(notification => {
        // if it is a like or refreet notification, check its status and update count
        if (notification.refreetDetails !== undefined) {
          notification.refreetDetails.notificationStatus === "NEW" && count++

        } else if (notification.likeDetails !== undefined) {
          notification.likeDetails.notificationStatus === "NEW" && count++

        } else {
          // else it is a follow request
          count ++
        }
      });
      return count;
    }
  }
}
</script>

<style scoped>
.notification-icon-container {
  position: relative;
}

.notification-icon-container span {
  white-space:nowrap;
  color: white;
  display: inline-flex;
  background-color: red;
  padding: 1px 4px;
  border-radius: 8px;
  position: absolute;
  top: -4px;
  left: 60%;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  font-size: 0.9rem;
}
</style>
