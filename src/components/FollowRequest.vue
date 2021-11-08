<template>
  <NotificationTemplate
    @notification-click="goToProfile"
    :notificationClass="notificationClass"
    :username="request.username"
    :dateAdded="request.dateAdded"
    message="sent you a follow request."
    iconClass="request"
    icon="user-plus">

    <template v-slot:controls>
      <div class="request-controls">
        <button @click.stop="accept">Accept</button>
        <button class="cancel" @click.stop="decline">Decline</button>
      </div>
    </template>

    <ConfirmDialog ref="confirm"/>
    
  </NotificationTemplate>
</template>

<script>
import { delete_, patch } from '../utils/crud-helpers';
import ConfirmDialog from './ConfirmDialog';
import NotificationTemplate from './NotificationTemplate';
import { eventBus } from '../main';


export default {
  name: "FollowRequest",

  props: {
    request: Object,
  },

  components: {
    ConfirmDialog, NotificationTemplate
  },

  computed: {
    notificationClass() {
      return this.request.notificationStatus.toLowerCase();
    }
  },

  methods: {
    goToProfile() {
      eventBus.$emit('navigate-to-profile', this.request.username);
    },

    accept() {
      patch('/api/user/followers', { username: this.request.username })
        .then(response => {
          const toastMessage = `${this.request.username} now follows you`;
          if (response.isSuccess) {
            eventBus.$emit('display-toast', toastMessage);
          } else {
            this.handleErrors(response, toastMessage);
          }
          // in both cases update the user
          this.$store.dispatch('getUser');
        })
    },

    async decline() {
      if (!await this.$refs.confirm.open(
        "Decline this request?",
        `${this.request.username} will be not be added to your followers and will not be notified by Fritter.`,
        "Decline"
      )) {
        return;
      }

      const options = { isPendingRequest: true };
      delete_(`/api/user/followers/${this.request.username}`, options)
        .then(response => {
          const requestUsername = this.request.username;
          const toastName = requestUsername.charAt(requestUsername.length - 1).toLowerCase() === "s"
                            ? `${requestUsername}'`
                            : `${requestUsername}'s`
          const toastMessage = `You declined ${toastName} follow request`;

          if (response.isSuccess) {
            eventBus.$emit('display-toast', toastMessage);
          } else {
            this.handleErrors(response, toastMessage);
          }
          // in both cases update the user
          this.$store.dispatch('getUser');
        })
    },

    handleErrors(response, toastMessage) {
      // if the error can be ignored from the backend
      if (response.data.error.ignoreError) {
        eventBus.$emit('display-toast', toastMessage);
        return;
      }
      // if for some reason the username is wrong
      if (response.data.error.username) {
        eventBus.$emit('display-alert', response.data.error.username);
      }

      if (response.data.error.relationError) {
        eventBus.$emit('display-alert', response.data.error.relationError);
      }
    }
  }

}
</script>

<style scoped>
.container{
  width: 100%;
}

.request-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 0.5rem;
}

.request-controls button {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

</style>