<template>
  <div class="searchbar-container">
    <input 
      name="author" 
      type="search"
      class="nav-input"
      value autocomplete="off"
      v-model="author"
      @keyup.enter="handleSubmit($event)"
      placeholder="Search Fritter"/> 
  </div>
</template>

<script>
import { eventBus } from '../main';


export default {
  name: "SearchBar",

  data() {
    return {
      author: "",
    }
  },

  computed: {
    canSubmit() {
      return this.author.trim().length > 0;
    },
  },

  methods: {
    handleSubmit(event) {
      // remove focus
      event.target.blur();

      if (!this.canSubmit) {
        return;
      }

      // navigate to the profile page
      this.submitSearchQuery(this.author.trim());
      
      // clear search query 
      this.author = ""; 
    },

    submitSearchQuery(author) {
      eventBus.$emit('search-query', author);
    }
  }
}
</script>

<style scoped>
.searchbar-container {
  max-width: 400px;
  flex-grow: 1;
  margin: 0 1rem;
}

.nav-input {
  padding: 12px 16px;
  transition: all 0.3s;
  height: var(--element-size);
  width: 100%;
  background-color: var(--theme-lighter);
  border: 1px solid lightgray;
  border-radius: 4px;
  font-size: 0.9rem
}
</style>