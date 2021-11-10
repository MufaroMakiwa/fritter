<template>
  <MainPageTemplate :loading="loading" :displaySidebar="true">  
    <div class="home-create-freet card" v-if="isSignedIn">
      <CreateFreet />
    </div>
    
    <div class="home-navigator">
      <h3 class="section-title title">{{ pageTitle }}</h3>
      <div class="toggle-container" v-if="isSignedIn">

        <span 
          :class="['home-toggle', activeTab === 'latest' ? 'active' : 'inactive']"
          @click="setActiveTab('latest')">
          Latest
        </span>

        <span 
          :class="['home-toggle', activeTab === 'discover' ? 'active' : 'inactive']"
          @click="setActiveTab('discover')">
          Discover
        </span>
      </div>
    </div>
    <div v-if="isSignedIn" class="freets-wrapper"> 
      <FreetsList 
        :freets="freets" 
        v-if="activeTab === 'latest'"
        :addLetsGoButton="true"
        emptyTitle="Welcome to Fritter!"
        emptySummary="This is the best place to see what's happening in the world. Find
                      some people to follow to see their freets and refreets here."/>

      <FreetsList 
        :freets="popularFreets" 
        v-else
        emptyTitle="No freets to display, yet!"
        emptySummary="This will help you discover users with the most trending content.
                      You can connect with these users to see all their freets and refreets on your feed."/>
    </div>

    <FreetsList 
      :freets="popularFreets" 
      v-else
      emptyTitle="No freets to display, yet!"
      emptySummary="Here, you will see freets posted by other users according to their popularity."/>    

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
      popularFreets: [],
      activeTab: "latest"
    }
  },

  computed: {
    isSignedIn() {
      return this.$store.getters.isSignedIn;
    },

    hasFreets() {
      return this.freets.length > 0;
    },

    pageTitle() {
      return this.isSignedIn ? "Feed" : "Explore";
    }
  },

  methods: {
    setActiveTab(tab) {
      if (this.activeTab === tab) return;
      this.activeTab = tab;

      let updatedRoute;
      const currentPath = window.location.pathname;

      // update the url
      if (tab === "latest") {
        if (!currentPath.includes("discover")) return;
        updatedRoute = currentPath.substring(0, currentPath.indexOf("discover") - 1);

      } else {
        const slash = currentPath.charAt(currentPath.length - 1) === "/" ? '' : "/";
        if (currentPath.includes("discover")) return;
        updatedRoute = `${currentPath}${slash}${tab.toLowerCase()}`
      }

      history.replaceState(
        {},
        null,
        updatedRoute
      )
    },

    getFreets() {
      get('/api/freets')
        .then((response) => {
          if (response.isSuccess) {
            this.freets = response.data.freets;
            this.popularFreets = response.data.popularFreets;
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

  mounted() {
    // update the selected tab
    if (this.$route.path.includes("discover")) {
      this.setActiveTab("discover");
    } else {
      this.setActiveTab("latest");
    }
  },

  created() {
    // if the route is discover, reload the page
    if (window.location.pathname.includes("discover")) {
      window.location.replace("/home");
    }

    // get all the freets when created
    console.log("Created");
    this.getFreets();

    // when a freet is modified, ping the db to get all freets in case
    // another user has posted a freet before the current user's post
    eventBus.$on('update-freets', this.freetModifiedListener);
    eventBus.$on('toggle-discover', this.setActiveTab);
  },
  
  beforeDestroy() {
    // unregister all eventBus listeners
    eventBus.$off('update-freets', this.freetModifiedListener);
    eventBus.$off('toggle-discover', this.setActiveTab);
  }
}
</script>

<style scoped>
.home-create-freet {
  padding: 1.5rem;
  margin-bottom: 3rem;
}

.home-navigator {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 1.5rem;
}

.home-navigator .title {
  margin-bottom: 0;
}

.toggle-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.home-toggle {
  height: 32px;
  border-radius: 16px;
  padding: 0 1rem;
  text-align: center;
  display: inline-flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.home-toggle.active {
  background-color: gray;
  color: white;
  border: 1px solid gray;
}

.home-toggle:last-of-type {
  margin-left: 1rem;
}

.home-toggle.inactive {
  border: 1px solid darkgray;
  color: gray;
  background-color: rgba(0, 0, 0, 0.05)
}

.home-toggle.inactive:hover {
  background-color: lightgray;
  color: black;
}
.freets-wrapper {
  width: 100%;
}

</style>