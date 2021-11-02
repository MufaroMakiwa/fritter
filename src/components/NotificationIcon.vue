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
      return this.requestsReceived > 99 ? "99+" : this.requestsReceived;
    },

    hasLabel() {
      return this.requestsReceived > 0;
    },

    requestsReceived() {
      return this.$store.getters.user.requestsReceived.length;
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
  font-size: 12px;
}
</style>
