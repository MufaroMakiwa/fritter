<template>
  <div class="container card">
    <h4>Suggestions</h4>

    <div v-if="hasSuggestions" class="suggestions-container">
      <div 
        v-for="suggestion in suggestions"
        :key="suggestion"
        class="suggestion-item">
        <div class="inner">
          <font-awesome-icon icon="user-circle" class="icon"/>

          <span class="username overflow-text">{{ suggestion }}</span>
          
          <FollowButton 
            followingStatus="NONE"
            :username="suggestion"
            :isSuggestion="true"/>
        </div>
      </div>
    </div>

    <span v-else>
      There are no suggestions for you
    </span>
  </div>
</template>

<script>
import FollowButton from '../components/FollowButton';

export default {
  name: "FollowSuggestions",

  props: {
    suggestions: {
      type: Array,
      default: () => []
    }
  },

  components: {
    FollowButton
  },

  computed: {
    hasSuggestions() {
      return this.suggestions.length > 0;
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
  margin: 0;
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

.suggestion-item {
  width: 100%;
  transition: all 0.3s;
  cursor: pointer;
  padding: 0 1.5rem;
  position: relative;
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
  background-color: var(--theme-lighter);
}

.icon {
  font-size: 1.75rem;
}

.username {
  margin-left: 0.5rem;
  flex-grow: 1;
}

</style>