<template>
  <div class="request-container">
    <div class="user-icon">
      <font-awesome-icon icon="user-circle" class="icon"/>
    </div>
    
    <div class="details">
      <span class="summary">
        <span @click="goToProfile">{{request.username}}</span> 
        has sent you a follow request.
      </span>

      <div class="request-controls">
        <span class="accept-button" @click="accept">Accept</span>
        <span class="decline-button" @click="decline">Decline</span>
      </div>
    </div>

    <ConfirmDialog ref="confirm"/>

    <AlertDialog ref="alert" />

  </div>
</template>

<script>
import { delete_, patch } from '../utils/crud-helpers';
import ConfirmDialog from './ConfirmDialog';
import AlertDialog from './AlertDialog';
import { eventBus } from '../main';


export default {
  name: "FollowRequest",

  props: {
    request: Object,
  },

  components: {
    ConfirmDialog, AlertDialog
  },

  methods: {
    goToProfile() {
      this.$router.push({ 
        name: "Profile",
        params: { author: this.request.username }
      });
    },

    accept() {
      patch('/api/user/followers', { username: this.request.username })
        .then(async response => {
          const toastMessage = `${this.request.username} now follows you`;
          if (response.isSuccess) {
            eventBus.$emit('display-toast', toastMessage);
          } else {
            await this.handleErrors(response, toastMessage);
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
        .then(async response => {
          // this is async to await error handling
          const requestUsername = this.request.username;
          const toastName = requestUsername.charAt(requestUsername.length - 1).toLowerCase() === "s"
                            ? `${requestUsername}'`
                            : `${requestUsername}'s`
          const toastMessage = `You declined ${toastName} follow request`;

          if (response.isSuccess) {
            eventBus.$emit('display-toast', toastMessage);
          } else {
            await this.handleErrors(response, toastMessage);
          }
          // in both cases update the user
          this.$store.dispatch('getUser');
        })
    },

    async handleErrors(response, toastMessage) {
      // if the error can be ignored from the backend
      if (response.data.error.ignoreError) {
        eventBus.$emit('display-toast', toastMessage);
        return;
      }
      // if for some reason the username is wrong
      if (response.data.error.username) {
        await this.$refs.alert.open(response.data.error.username);
      }

      if (response.data.error.relationError) {
        await this.$refs.alert.open(response.data.error.relationError);
      }
    }
  }

}
</script>

<style scoped>
.request-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1.5rem 0;
  border-bottom: 1px solid lightgray;
}

.request-container:first-of-type {
  border-top: 1px solid lightgray
}

.user-icon {
  font-size: 1.75rem;
  margin: 0 1.5rem;
  color: gray;
}

.details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}

.details .summary {
   word-break: normal;
}

.details .summary span {
  font-weight: bold;
}

.details .summary span:hover {
  cursor: pointer;
  text-decoration: underline;
}

.request-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 0.5rem;
}

.request-controls span {
  transition: all 0.3s;
  cursor: pointer;
}

.accept-button {
  color: var(--theme-color);
  margin-right: 1rem;
}

.accept-button:hover {
  color: var(--button-color-hover);
}

.decline-button {
  color: gray;
}

.decline-button:hover {
  color: darkgray;
}
</style>