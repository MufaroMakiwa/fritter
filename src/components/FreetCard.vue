<template>
  <div class="freet-outer">
    <span v-if="isRefreet" class="refreet-label">
      <font-awesome-icon icon="retweet" class="icon"/>

      <span @click="goToProfile(freet.refreetedBy)">
        {{ refreetLabel }} refreeted this {{ refreetTime }}
      </span>
    </span>

    <div class="freet-container">
      <div class="freet-icon-container">
        <FreetIcon :username="freet.author"/>
      </div>

      <section class="freet-details">
        <span class="freet-author" @click="goToProfile(freet.author)">{{ freet.author }}</span>

        <span class="freet-timestamp">{{ timestamp }}</span>

        <p class="freet-content" v-if="!editingFreet">{{ freet.content }}</p>

        <div class="freet-actions">
          <div class="freet-actions-inner" v-if="!editingFreet">
            <div 
              :class="['icon-container', 'like', !isSignedIn ? 'disabled' : '', isCurrentUserLiking ? 'liked' : '']"  
              @click="handleLike"
              :data-tooltip="isCurrentUserLiking ? 'Dislike' : 'Like'">
              <font-awesome-icon icon="heart" class="icon"/>
              <span class="icon-summary" v-if="likes > 0">{{ likes }}</span>
            </div>

            <div 
              :class="['icon-container', 'refreet', !isSignedIn ? 'disabled' : '', isCurrentUserRefreeting ? 'refreeted' : '']" 
              :data-tooltip="isCurrentUserRefreeting ? 'Unrefreet' : 'Refreet'"
              @click="handleRefreet">
              <font-awesome-icon icon="retweet" class="icon"/>
              <span class="icon-summary" v-if="refreets > 0">{{ refreets }}</span>
            </div>
            
            <div 
              v-if="isCurrentUserAuthor"
              class="icon-container delete" 
              data-tooltip="Delete"
              @click="deleteFreet">
              <font-awesome-icon 
                icon="trash-alt" 
                class="icon"/>
            </div>
            
            <div 
              v-if="isCurrentUserAuthor"
              class="icon-container edit" 
              data-tooltip="Edit"
              @click="displayEditFreet">
              <font-awesome-icon 
                icon="edit" 
                class="icon"/>
            </div>
          </div>

          <CreateFreet 
            v-else
            :autofocus="true"
            :freetId="freet.freetId"
            :value="this.freet.content"
            :editingFreet="editingFreet"/>

          <span class="input-error" v-if="hasFreetError">{{ freetError }}</span>
        </div>        
      </section>
    </div>

    <ConfirmDialog ref="confirm"/>
  </div>
</template>

<script>
import FreetIcon from './FreetIcon';
import { delete_, post } from '../utils/crud-helpers';
import { formattedTimePast } from '../utils/utilities';
import ConfirmDialog from './ConfirmDialog';
import { eventBus } from '../main';
import CreateFreet from './CreateFreet';

export default {
  name: "FreetCard",

  props: {
    freet: Object,
  },

  data () {
    return {
      editingFreet: false,
      freetError: ""
    }
  },

  components: {
    FreetIcon, CreateFreet, ConfirmDialog
  },

  computed: {
    user() {
      return this.$store.getters.user;
    },

    isSignedIn() {
      return this.$store.getters.isSignedIn;
    },

    likes() {
      return this.freet.likes.length;
    },

    isRefreet() {
      return this.freet.displayAsRefreet;
    },

    refreetLabel() {
      // this is because if its not a refreet, the refreetedBy field will be undefined
      if (!this.isRefreet) {
        return '';
      }

      if (this.isSignedIn && this.user.username === this.freet.refreetedBy) {
        return "You";

      } else {
        return this.freet.refreetedBy;
      }
    },

    refreetTime() {
      if (!this.isRefreet) {
        return "";
      }
      return formattedTimePast(this.freet.dateRefreeted);
    },

    refreets() {
      return this.freet.refreets.length;
    },

    isCurrentUserLiking() {
      return this.isSignedIn && this.freet.likes.includes(this.user.username);
    },

    isCurrentUserRefreeting() {
      return this.isSignedIn && this.freet.refreets.includes(this.user.username);
    },

    isCurrentUserAuthor() {
      return this.isSignedIn && this.user.username === this.freet.author;
    },

    // this will be true when any unforseen error happens that is sent from the server
    // and is not handled separately, e.g, if somehow a wrong freet id is entered which
    // make delete impossible or when some user tries to modify a freet they did not create
    hasFreetError() {
      return this.freetError.length !== 0;
    },

    timestamp() {
      const created = new Date(this.freet.dateCreated);
      const modified = new Date(this.freet.dateModified);

      if (modified.getTime() > created.getTime()) {
        return `Modified ${formattedTimePast(this.freet.dateModified)}`;
      } else {
        return `Posted ${formattedTimePast(this.freet.dateModified)}`;
      }
    },
  },

  methods: {
    displayEditFreet() {
      this.editingFreet = true;
    },

    pushToProfile(author) {
      this.$router.push({ 
        name: "Profile",
        params: { author: author }
      });
    },

    goToProfile(author) {
      if (this.$route.name === "Profile") {
        if (this.$route.params.author === author) {
          this.$router.go();
        } else {
          this.pushToProfile(author);
        }        
      } else {
        this.pushToProfile(author);
      }
    },

    stopEditingFreetListener() {
      this.editingFreet = false;
    },

    async deleteFreet() {
       if (await this.$refs.confirm.open(
        "Delete Freet?",
        "This can’t be undone and the freet will be removed from your profile and the timeline of any users that follow you.",
        "Delete"
      )) {
        delete_(`/api/freets/${this.freet.freetId}`)
          .then(response => {
            const toastMessage = "You deleted a freet";
            if (response.isSuccess) {
              eventBus.$emit('display-toast', toastMessage);

            } else {
              this.handleDeleteErrors(response, toastMessage);
            }
            // in both cases update the freets
            eventBus.$emit('update-freets');
          });
      }
    },

    handleLike() {
      if (!this.isSignedIn) {
        return;
      }   
      this.isCurrentUserLiking 
      ? this.toggleLike(delete_, "You disliked a freet") 
      : this.toggleLike(post, "You liked a freet");
    },

    toggleLike(func, toastMessage) {
      func(`/api/freets/${this.freet.freetId}/likes`)
        .then(response => {
          if (response.isSuccess) {
            eventBus.$emit('display-toast', toastMessage);

          } else { 
            this.handleLikeErrors(response, toastMessage);
          }
          // in both cases, trigger a refresh
          eventBus.$emit('update-freets');
        })
    },

    handleRefreet() {
      if (!this.isSignedIn) {
        return;
      }  
      this.isCurrentUserRefreeting 
      ? this.toggleRefreet(delete_, "You unrefreeted a freet") 
      : this.toggleRefreet(post, "You refreeted a freet");
    },

    toggleRefreet(func, toastMessage) {
      func(`/api/freets/${this.freet.freetId}/refreets`)
        .then(response => {
          if (response.isSuccess) {
            eventBus.$emit('display-toast', toastMessage);

          } else {
            this.handleRefreetErrors(response, toastMessage);
          }
          // in both cases, trigger a refresh
          eventBus.$emit('update-freets');
        })
    },

    handleFreetNotFound(response) {
      // this may happen when a freet in deleted in another session while the
      // user in another current session is trying to modify the same freet
      if (response.data.error.freetNotFound) {
        eventBus.$emit('display-alert', "Sorry, this freet has already been deleted.");
        return true;
      }
      return false;
    },

    handleDeleteErrors(response, toastMessage) {
      // if the freet is not found, the user has already deleted it. No need to 
      // display the deleted alert
      if (response.data.error.freetNotFound) {
        eventBus.$emit("display-toast", toastMessage)
        return;
      }
      // this error is probably gonna be due to unathorized edit or invalid
      // freetId. It is unlikely to happen since the UI does not allow it
      this.freetError = response.data.error;
    },

    handleLikeErrors(response, toastMessage) {
      if (this.handleFreetNotFound(response)) {
        return;
      }
      // this will probably happen when a user (un)likes a freet in another
      // browser and tries to (un)like in a different browser. There is no need 
      // to display an alert since it will simply get this in sync with other sessions
      if (response.data.error.ignoreError) {
        eventBus.$emit('display-toast', toastMessage);
      }

      // no other like error expected
    },

    handleRefreetErrors(response, toastMessage) {
      if (this.handleFreetNotFound(response)) {
        return;
      }
      // this will probably happen when a user (un)likes a freet in another
      // browser and tries to (un)like in a different browser
      if (response.data.error.ignoreError) {
        eventBus.$emit('display-toast', toastMessage);
      }

      // no other refreet error expected.
    }
  },

  created() {
    eventBus.$on('stop-editing-freet', this.stopEditingFreetListener);
  },

  beforeDestroy() {
    eventBus.$off('stop-editing-freet', this.stopEditingFreetListener);
  }
}
</script>

<style scoped>
.freet-outer {
  padding: 1.5rem;
  border-bottom: 1px solid lightgray;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  transition: all 0.3s;
}

.refreet-label {
  margin-bottom: 1.5rem;
  color: gray;
}

.refreet-label span {
  margin-left: 1rem;
}

.refreet-label:hover {
  text-decoration: underline;
  cursor: pointer;
}

.freet-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  transition: all 0.3s;
}

.freet-details {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.freet-author {
  font-weight: bold;
  font-size: 16px;
  padding-bottom: 2px;
  width: fit-content;
}

.freet-author:hover {
  text-decoration: underline;
  cursor: pointer;
}

.freet-timestamp {
  color: gray;
}

.freet-content {
  margin-top: 16px;
}

.freet-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
  width: 100%;
}

.freet-actions-inner {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
}

.icon-container {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  transition: all 0.3s;
  width: fit-content;
  cursor: pointer;
  position: relative;
}

.icon-container > * {
  z-index: 1;
}

.freet-actions-inner .icon {
  font-size: 1.1rem;
  transition: all 0.3s;
}

.freet-actions-inner .icon-summary {
  margin-left: 8px;
  font-size: 0.9rem;
  color: gray;
}

.icon-container::before {
  content: "";
  position: absolute;
  top: -0.4rem;
  right: -0.4rem;
  left: -0.4rem;
  bottom: -0.4rem;
  z-index: 0;
  border-radius: 8px;
  opacity: 0;
}

.icon-container:hover::before {
  opacity: 1;
  transition: all 0.15s;
}

.icon-container.edit:hover::before {
  background-color: var(--input-color-hover);
}

.icon-container.edit:hover > * {
  color: var(--theme-color);
}

.icon-container.delete:hover::before {
  background-color: rgb(243, 217, 217);
}

.icon-container.delete:hover > * {
  color: red;
}

.icon-container.like:hover::before {
  background-color: rgb(241, 233, 217);
}

.icon-container.like.liked > *,
.icon-container.like:hover > * {
  color: orange;
}

.icon-container.refreet:hover::before {
  background-color: rgb(220, 231, 220);
}

.icon-container.refreet.refreeted > *,
.icon-container.refreet:hover > * {
  color: green;
}

.icon-container.disabled {
  cursor: not-allowed;
}

.icon-container.disabled::before {
  display: none;
}

.icon-container.disabled > *,
.icon-container.disabled:hover > * {
  color: lightgray;
}

.icon-container::after {
  content: attr(data-tooltip);
  position: absolute;
  top: 175%;
  left: -1rem;
  right: -1rem;
  margin: auto;
  width: fit-content;
  font-size: 0.8rem;
  background: rgb(206, 206, 206);
  padding: 2px 4px;
  border-radius: 4px;
  text-align: center;
  transition: all 0.1s 0.2s;
  transform: scale(0);
  pointer-events: none;
}

.icon-container:hover::after {
  transform: scale(1);
}

.icon-container.disabled::after {
  display: none;
}

</style>