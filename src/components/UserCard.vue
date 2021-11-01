<template>
  <div class="user-container" @click="goToProfile">
    <div class="user-icon">
      <font-awesome-icon icon="user-circle" class="icon"/>
    </div>
  
    <div class="user-details">
      <span class="username">{{ user.username }}</span>
      <span class="joined">Joined {{ dateJoined }}</span>
    </div>

    <FollowButton 
      v-if="!isCurrentUser"
      :followingStatus="user.followingStatus"
      :username="user.username"/>

    <button
      v-if="displayRemoveButton"
      class="profile-header-button remove-button"
      @click.stop="removeFollower">
      Remove
    </button>
  </div>
</template>

<script>
import FollowButton from './FollowButton';
import { eventBus } from '../main';
import { formattedDate } from '../utils/utilities';
import { delete_ } from '../utils/crud-helpers';


export default {
  name: "UserCard",

  props: {
    user: Object,

    displayRemoveButton: {
      default: false,
      type: Boolean,
    }
  },

  components: {
    FollowButton
  },
  
  computed: {
    isSignedIn() {
      return this.$store.getters.isSignedIn;
    },

    isCurrentUser() {
      return this.isSignedIn
      && this.user.username === this.$store.getters.user.username;
    },

    dateJoined() {
      return formattedDate(this.user.dateJoined);
    }
  },

  methods: {
    goToProfile() {
      eventBus.$emit("navigate-to-profile", this.user.username);
    },

    removeFollower() {
      if (!confirm(`Are you sure you want to do not want ${this.user.username} to follow you`)) {
        return;
      }

      const options = { isPendingRequest: false };
      delete_(`/api/user/followers/${this.user.username}`, options)
        .then(response => {
          if (response.isSuccess) {
            eventBus.$emit('display-toast', response.data.message);
          } else {
            this.handleFollowErrors(response);
          }
          eventBus.$emit('update-profile');
        })
    },

    handleFollowErrors(response) {
      if (response.data.error.username) {
        alert(response.data.error.username);
      }

      if (response.data.error.relationError) {
        alert(response.data.error.relationError);
      }
    },
  }
}
</script>

<style scoped>
.user-container {
  display: flex;
  padding: 2rem;
  border-bottom: 1px solid lightgray;
  flex-direction: row;
  width: 100%;
  transition: all 0.3s;
  align-items: center;
}

.user-container:hover {
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.20) inset;
  cursor: pointer
}

.user-container .user-icon {
  font-size: 2.5rem;
  color: gray;
}


.user-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-left: 2rem;
}

.user-details .username {
  font-weight: bold;
}

.user-details .joined {
  color: gray;
  font-size: 0.9rem;
} 

.remove-button {
  border: 1px solid gray;
  background-color: white;
  color: gray;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

.remove-button:hover {
  border: 1px solid red;
  color: red;
  background-color: rgb(241, 224, 224);
}

</style>