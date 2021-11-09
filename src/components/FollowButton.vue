<template>
  <div>
    <span v-if="isFreet" class="follow-span" @click="handleFollow">
      Follow
    </span>

    <button 
      v-else
      :class="['profile-header-button', 'follow-button', followButton.cssClass, isSuggestion ? 'medium' : '' ]" 
      :data-hover="followButton.hoverText"
      :data-text="followButton.text"
      @click.stop="handleFollow">
    </button>

    <ConfirmDialog ref="confirm"/>
  </div>
</template>

<script>
import { eventBus } from '../main';
import { post, delete_ } from '../utils/crud-helpers';
import ConfirmDialog from './ConfirmDialog';

export default {
  name: "FollowButton",

  props: {
    followingStatus: String,

    username: String,

    isSuggestion: {
      default: false,
      type: Boolean,
    },

    isFreet: {
      default: false,
      type: Boolean,
    }
  },

  components: {
    ConfirmDialog
  },

  computed: {
    followButton() {
      switch(this.followingStatus) {
        case "ACTIVE":
          return {
            text: "Following",
            hoverText: "Unfollow",
            cssClass: "active"
          }

        case "PENDING":
          return {
            text: "Pending",
            hoverText: "Cancel",
            cssClass: "pending"
          };
        
        default:
          return {
            text: "Follow",
            hoverText: "Follow",
            cssClass: "follow"
          };
      }
    },

    firesEvent() {
      const routeName = this.$route.name;
      return routeName === "Home" || routeName === "Profile";
    },

    event() {
      return this.$route.name === "Profile" ? 'update-profile' : 'update-freets'
    }
  },

  methods: {
    addFollow() {
      post('/api/user/following', { username: this.username })
        .then(response => {
          if (response.isSuccess) {
            const toastMessage = response.data.followResponse.relationStatus === "ACTIVE"
                                ? `You are now following ${this.username}`
                                : `You sent a follow request to ${this.username}`;
            eventBus.$emit('display-toast', toastMessage);

          } else {
            // for ingore error, the error message depends on the relation status
            this.handleFollowErrors(response);
          }
          // in both cases, update the user's profile and user obj
          this.$store.dispatch("getUser");
          this.firesEvent && eventBus.$emit(this.event);
        })
    },

    removeFollow(isPendingRequest) {
      const options = { isPendingRequest }
      delete_(`/api/user/following/${this.username}`, options)
        .then(response => {
          const toastMessage = isPendingRequest 
                    ? `You canceled follow request to ${this.username}`
                    : `You are nolonger following ${this.username}`;

          if (response.isSuccess) {
            eventBus.$emit('display-toast', toastMessage);

          } else {
            this.handleFollowErrors(response, toastMessage);
          }
          // in both cases, update the user's profile
          this.$store.dispatch("getUser");
          eventBus.$emit('update-profile');
        })
    },

    handleFollowErrors(response, toastMessage) {
      // if the error can be ignored from the backend
      if (response.data.error.ignoreError) {
        if (toastMessage) {
          eventBus.$emit('display-toast', toastMessage);

        } else {
          // this will be when the toast message depends on the status prop of ignore error
          const message = response.data.error.ignoreError.status === "ACTIVE"
                          ? `You are now following ${this.username}`
                          : `You sent a follow request to ${this.username}`;
          eventBus.$emit('display-toast', message);
        }
        return;
      }
      // if for some reason the username is wrong
      if (response.data.error.username) {
        eventBus.$emit('display-alert', response.data.error.username);
      }

      if (response.data.error.relationError) {
        eventBus.$emit('display-alert', response.data.error.relationError);
      }

      // other expected errors are when user is not logged in and that is 
      // handled in App.vue
    },


    async handleFollow() {
      switch(this.followingStatus) {
        case "ACTIVE":
          if (await this.$refs.confirm.open(
            `Unfollow ${this.username}?`,
            "You will not be able to see their activity on your feed. You can still view their profile unless they have a private account.",
            "Unfollow"
          )) {
            this.removeFollow(false);
          }         
          break;

        case "PENDING":    
          this.removeFollow(true);
          break;

        case "NONE":
          this.addFollow();
          break;
        
        default:
      }
    },
  }
}
</script>

<style scoped>
.follow-button {
  position: relative;
  display: inline-block;
}

.follow-button.medium {
  width: 75px;
  height: 32px;
  border-radius: 16px;
}

.follow-button::before,
.follow-button::after {
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
}

.follow-button::before {
  content: attr(data-text);
  opacity: 1;
}

.follow-button:after {
  content: attr(data-hover);
  opacity: 0;
}

.follow-button:hover::after {
  opacity: 1;
}

.follow-button:hover::before {
  opacity: 0;
}

/* styles for follow button when not following  */

.follow-button.follow {
  background-color: black;
  border: 1px solid black;
}

.follow-button.follow::before {
  color: white
}

.follow-button.follow:hover {
  background-color: gray;
  border: 1px solid gray;
}

.follow-button.follow:hover::after {
  color: white;
}

/* styles for follow button when following */

.follow-button.active {
  background-color: var(--theme-color);
  border: 1px solid var(--theme-color);
}

.follow-button.active::before {
  color: white;
}

.follow-button.active:hover {
  background-color: rgb(243, 217, 217);
  border: 1px solid red;
}

.follow-button.active::after {
  color: red;
}

/* styles for follow button when pending */

.follow-button.pending {
  background-color: lightgray;
  border: 1px solid lightgray;
}

.follow-button.pending::before {
  color: gray;
}

.follow-button.pending:hover {
  background-color: rgb(243, 217, 217);
  border: 1px solid red;
}

.follow-button.pending::after {
  color: red;
}

.follow-button:disabled {
  background-color: lightgray;
  border: 1px solid lightgray;
  color: gray;
}

.follow-span {
  color: var(--theme-color);
  margin-left: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.follow-span:hover {
  color: var(--button-color-hover);
}
</style>