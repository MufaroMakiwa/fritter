<template>
  <MainPageTemplate :loading="loading">
    <div class="home-container">
      <section class="main-section">
        <div class="home-create-freet card" v-if="isSignedIn">
          <CreateFreet />
        </div>

        <h2>Feed</h2>
        <FreetsList :freets="freets" />
      </section>

      <section class="suggestions-section">
        <FollowSuggestions :suggestions="suggestions"/>
      </section>
    </div>

  </MainPageTemplate>
</template>

<script>
import MainPageTemplate from '../components/MainPageTemplate';
import CreateFreet from '../components/CreateFreet';
import FollowSuggestions from '../components/FollowSuggestions';
import FreetsList from '../components/FreetsList';
import { eventBus } from '../main';
import { get } from '../utils/crud-helpers';



export default {
  name: "Home",

  components: {
    MainPageTemplate, CreateFreet, FreetsList, FollowSuggestions
  },

  data() {
    return {
      loading: true,
      freets: [],
      suggestions: ["mufaro", "emmanuel", "makiwa"]
    }
  },

  computed: {
    isSignedIn() {
      return this.$store.getters.isSignedIn;
    },

    hasFreets() {
      return this.freets.length > 0;
    }
  },

  methods: {
    getFreets() {
      get('/api/freets')
        .then((response) => {
          if (response.isSuccess) {
            this.freets = response.data;
          } else {
            // this request is not expected to throw any errors from the server
            // if any happens, the freets will not be updates
          }
          // update loading to false if true
          this.loading && (this.loading = false);
        });
    },

    freetModifiedListener() {
      // ensure that the user object is up to date
      this.$store.dispatch("getUser");

      // update the freets
      this.getFreets();
    }
  },

  created() {
    // get all the freets when created
    this.getFreets();

    // when a freet is modified, ping the db to get all freets in case
    // another user has posted a freet before the current user's post
    eventBus.$on('update-freets', this.freetModifiedListener);
  },
  
  beforeDestroy() {
    // unregister all eventBus listeners
    eventBus.$off('update-freets', this.freetModifiedListener);
  }
}
</script>

<style scoped>
.home-container {
  --sidebar-width: 260px;
  width: 100%;
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: flex-start;
  justify-content: flex-start;
}

.main-section {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: flex-start;
  justify-content: flex-start;
}

.suggestions-section {
  width: var(--sidebar-width);
  flex-shrink: 0;
  margin-left: 2rem;
  position: sticky;
  top: calc(var(--nav-bar-height) + var(--page-padding));
}

.home-create-freet {
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

h2 {
  color: gray;
}
</style>