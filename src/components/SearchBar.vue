<template>
  <div class="searchbar-container">
    <input 
      name="author" 
      type="search"
      class="nav-input"
      value autocomplete="off"
      @input="getSuggestions"
      v-model="author"
      @keyup.enter="handleSubmit($event)"
      placeholder="Search Fritter"/> 

    <div 
      :class="['search-suggestions', displayLoadingAnimation ? 'loading' : '']">
      <span 
        class="placeholder"
        v-if="!canSubmit">Search for people by username</span>
      
      <div 
        class="suggestions-container" 
        v-else-if="!typing">
        <div 
          class="suggestion"
          v-for="suggestion in suggestions"
          :key="suggestion"
          @mousedown.prevent @click="submit(suggestion)">     
          <font-awesome-icon icon="user-circle" class="icon suggest"/>     
          <span>{{ suggestion }}</span>
        </div>

        <div 
          class="suggestion default" 
          @mousedown.prevent @click="submit(author)">
          <div class="icon-container">
            <font-awesome-icon icon="search" class="icon search"/>
          </div>
          <span> Search for <b>{{ author }}</b></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { eventBus } from '../main';
import { get } from '../utils/crud-helpers';

export default {
  name: "SearchBar",

  data() {
    return {
      author: "",
      suggestions: [],
      debounce: null,
      typing: true
    }
  },

  watch: {
    author() {
      if (!this.canSubmit) {
        this.suggestions = [];
      }
    }
  },

  computed: {
    canSubmit() {
      return this.author.trim().length > 0;
    },

    displayLoadingAnimation() {
      return this.canSubmit && this.typing;
    }
  },

  methods: {
    submit(author) {
      if (!this.canSubmit) {
        return;
      }

      // navigate to the profile page
      this.submitSearchQuery(author);
      
      // clear search query 
      this.author = ""; 
    },

    submitSearchQuery(author) {
      eventBus.$emit('search-query', author);
    },

    handleSubmit(event) {
      // remove focus
      event.target.blur();
      this.submit(this.author.trim());
    },

    getSuggestions() {
      clearTimeout(this.debounce)
      if (!this.canSubmit) {
        this.typing = false;
        return;
      }
      
      this.typing = true;
      this.debounce = setTimeout(() => {
        const query = { querytext: this.author.trim() }
        get('/api/user/search', query)
          .then(response => {
            if (response.isSuccess) {
              this.suggestions = response.data.suggestions;
              this.typing = false;
            }
            // this endpoint is not expected to throw any errors
          });
      }, 300);
      
    },
  }
}
</script>

<style scoped>
.searchbar-container {
  max-width: 400px;
  flex-grow: 1;
  margin: 0 1rem;
  position: relative;
}

.nav-input {
  padding: 12px 16px;
  transition: all 0.3s;
  height: var(--element-size);
  width: 100%;
  background-color: var(--theme-lighter);
  border-radius: calc(var(--element-size) / 2);
  font-size: 0.9rem;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: 1rem;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.20);
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  transition: all 0.3s;
  min-height: 5rem;
  display: none;
  overflow: hidden;
}

.search-suggestions.loading::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 25%;
  height: 3px;
  background-color: var(--theme-color);
  animation: slide 1s linear infinite;
}

@keyframes slide {
  from { 
    left: 0
  }

  to {
    left: 100%;
  }
}

.nav-input:focus + .search-suggestions {
  display: flex;
}

.suggestions-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.placeholder {
  width: 100%;
  text-align: center;
  color: gray;
  font-size: 0.9rem;
}

.suggestion {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0.5rem;
  transition: all 0.3s;
  border-radius: 8px;
  cursor: pointer;
}

.suggestion:hover {
  background: var(--theme-lighter);
}

.icon-container,
.suggest {
  border-radius: 50%;
  width: 32px;
  height: 32px;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: gray;
}

.icon.search {
  color: white
}

.suggestion span {
  margin-left: 1.5rem;
}

.suggestion.default > * {
  color: var(--theme-color);
}


.suggestion.default .icon-container {
  background-color: var(--theme-color);
}

</style>