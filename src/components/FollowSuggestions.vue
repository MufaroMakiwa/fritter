<template>
  <div class="container card">
    <h4>{{ heading }}</h4>

    <div v-if="hasSuggestions" class="suggestions-container">
      <div 
        v-for="suggestion in suggestions"
        :key="suggestion.username"
        @click="goToProfile(suggestion.username)"
        class="suggestion-item">
        <div class="inner">
          <font-awesome-icon icon="user-circle" class="icon"/>

          <span class="username overflow-text">{{ suggestion.username }}</span>
          
          <FollowButton v-if="isSignedIn"
            followingStatus="NONE"
            :username="suggestion.username"
            size="small"/>
        </div>
      </div>
    </div>

    <span v-else class="message">
      There are no suggestions for you.
    </span>
  </div>
</template>

<script>
import FollowButton from '../components/FollowButton';
import { eventBus } from '../main';

export default {
  name: "FollowSuggestions",

  components: {
    FollowButton
  },

  computed: {
    suggestions () {
      return this.$store.getters.suggestions;
    },

    hasSuggestions() {
      return this.suggestions.length > 0;
    },

    isSignedIn() {
      return this.$store.getters.isSignedIn;
    },

    heading() {
      return this.isSignedIn ? "Suggestions for you" : 'Popular users';
    }
  },

  methods: {
    goToProfile(username) {
      eventBus.$emit('navigate-to-profile', username);
    }
  }

}
</script>

<style scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}

.container h4 {
  padding: 1rem 1.5rem;
  color: gray;
  width: 100%;
  text-align: left;
  border-bottom: 1px solid var(--theme-lighter);
}

.suggestions-container {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.message {
  padding: 1.5rem;
  color: gray;
}

.suggestion-item {
  width: 100%;
  transition: all 0.3s;
  cursor: pointer;
  padding: 0 1.5rem;
  position: relative;
}

.suggestion-item:last-of-type {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.suggestion-item .inner {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-top: 1px solid var(--theme-lighter);
  padding: 1.5rem 0;
}

.suggestion-item:first-of-type .inner {
  border-top: none;
}

.suggestion-item:hover {
  background-color: whitesmoke;
}

.icon {
  font-size: 1.75rem;
}

.username {
  margin-left: 0.5rem;
  flex-grow: 1;
}

</style>