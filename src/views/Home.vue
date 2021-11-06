<template>
  <MainPageTemplate :loading="loading" :displaySidebar="true">  
    <div class="home-create-freet card" v-if="isSignedIn">
      <CreateFreet />
    </div>

    <h2 class="section-title">Feed</h2>
    <FreetsList :freets="freets" />

  </MainPageTemplate>
</template>

<script>
import MainPageTemplate from '../components/MainPageTemplate';
import CreateFreet from '../components/CreateFreet';
import FreetsList from '../components/FreetsList';
import { eventBus } from '../main';
import { get } from '../utils/crud-helpers';



export default {
  name: "Home",

  components: {
    MainPageTemplate, CreateFreet, FreetsList
  },

  data() {
    return {
      loading: true,
      freets: [],
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
.home-create-freet {
  padding: 1.5rem;
  margin-bottom: var(--page-padding);
}

</style>