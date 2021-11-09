<template>
  <div
    :class="[ 'notification-card-container', notificationClass ]"
    @click.stop="$emit('notification-click')">
    
    <div class="notification-card-user-icon">
      <font-awesome-icon icon="user-circle" class="icon"/>

      <div class="info-icon-container">
        <div :class="[ 'inner', iconClass ]">
          <font-awesome-icon :icon="icon" class="info-icon"/>
        </div>
      </div>
    </div>

    <div class="notification-card-details">
      <span class="summary">
        <b>{{ username }}</b> {{ message }}
      </span>

      <slot name="content"></slot>

      <span class="date">{{ date }}</span>

      <slot name="controls"></slot>
    </div>

    <div v-if="notOpened" class="dot-container">
      <div class="dot"></div>
    </div>
  </div>
</template>

<script>
import { formattedTimePast } from '../utils/utilities';


export default {
  name: "NotificationTemplate",
  

  props: {
    notificationClass: String,
    username: String,
    dateAdded: String,
    message: String,
    icon: String,
    iconClass: String
  },

  computed: {
    date() {
      return formattedTimePast(this.dateAdded);
    },

    notOpened() {
      return this.notificationClass !== "opened";
    },
  },
}
</script>

<style scoped>
.notification-card-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1.5rem 0;
  border-bottom: 1px solid lightgray;
  /* border-left: 1px solid lightgray;
  border-right: 1px solid lightgray; */
  cursor: pointer;
  transition: all 0.3s;
}

.notification-card-container:first-of-type {
  border-top: 1px solid lightgray
}

.notification-card-container.new {
  background-color: var(--input-color-hover);
}

.notification-card-container:hover {
  background-color: whitesmoke;
}

.notification-card-user-icon {
  position: relative;
  margin: 0 1.5rem;
}

.notification-card-user-icon .icon {
  font-size: 2.2rem;
}

.info-icon-container {
  position: absolute;
  bottom: -25%;
  right: -25%;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: white;
  padding: 2px;
}

.info-icon-container .inner {
  border-radius: 50%;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-icon-container .inner.like {
  background-color: orange;
}

.info-icon-container .inner.refreet {
  background-color: green;
}

.info-icon-container .inner.request {
  background-color: red;
}

.info-icon-container .inner.follow {
  background-color: var(--theme-color);
}

.info-icon-container .info-icon {
  font-size: 0.9rem;
  color: white;
}

.notification-card-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  flex-grow: 1;
}

.notification-card-details .summary {
   word-break: normal;
}

.notification-card-details .date {
  margin-top: 0.5rem;
  color: var(--theme-color);
  font-size: 0.9rem;
}

.notification-card-content {
  margin-top: 1rem;
  margin-bottom: 0;
  color: gray;
  word-break: normal;
}

.notification-card-container.opened .summary,
.notification-card-container.opened .date {
  color: gray;
}

.notification-card-container.opened .info-icon-container .inner {
  background-color: gray;
}

.dot-container {
  margin-right: 2rem;
  margin-left: 1.5rem;
  display: flex;
  justify-content: center;
  align-self: center;
}

.dot-container .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--theme-color);
}
</style>