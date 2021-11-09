<template>
  <MainPageTemplate :loading="loading" :displaySidebar="true">
    <ProfileHeader 
      :isAuthorExists="isAuthorExists"
      :isCurrentUser="isCurrentUser"
      :author="author"
      :activeTab="activeTab"
      :freetsCount="freets.length"
      :refreetsCount="refreets.length"
      :likesCount="likes.length"
      :followersCount="followers.length"
      :followingCount="following.length"
      :hasPrivateInformation="hasPrivateInformation"
      :followingStatus="followingStatus"
      :followsCurrentUser="followsCurrentUser"/>

    <div v-if="isAuthorExists" class="profile-container">
      <div class="profile-details-section">
        <h2 class="section-title">{{ sectionTitle }}</h2>
        <FreetsList 
          v-if="activeTab === 'freets'"
          :freets="freets"/>

        <FreetsList 
          v-if="activeTab === 'refreets'"
          :freets="refreets"/>

        <FreetsList 
          v-if="activeTab === 'likes'"
          :freets="likes"/>

        <UsersList 
          v-if="activeTab === 'followers'"
          :users="followers"
          :displayRemoveButton="isCurrentUser"
          emptyMessage="You do not have any followers!"/>

        <UsersList 
          v-if="activeTab === 'following'"
          :users="following"
          emptyMessage="You are currently not following anyone!"/>    
      </div>   
    </div>

    <div v-else class="not-exist">
      <h2 class="section-title">This account does not exist!</h2>
      <span>Try searching for another</span>
    </div>
  </MainPageTemplate>
</template>

<script>
import MainPageTemplate from '../components/MainPageTemplate';
import ProfileHeader from '../components/ProfileHeader';
import FreetsList from '../components/FreetsList';
import UsersList from '../components/UsersList';
import { get } from '../utils/crud-helpers';
import { eventBus } from '../main';

export default {
  name: "Profile",

  components: {
    MainPageTemplate, FreetsList, ProfileHeader, UsersList
  },

  data() {
    return {
      freets: [],
      refreets: [],
      likes: [],
      followers: [],
      following: [],
      hasPrivateInformation: false,
      followingStatus: "NONE", // can be "NONE", "ACTIVE", "PENDING"
      author: null,
      isAuthorExists: false,
      activeTab: "freets",
      loading: true,
      followsCurrentUser: false
    }
  },

  computed: {
    sectionTitle() {
      return this.activeTab.charAt(0).toUpperCase() + this.activeTab.slice(1);
    },

    user() {
      return this.$store.getters.user;
    },

    isSignedIn() {
      return this.$store.getters.isSignedIn;
    },

    isCurrentUser() {
      return this.isSignedIn
      && this.isAuthorExists
      && this.author.username === this.user.username;
    }
  },

  methods: {
    getAuthorDetails() {
      const author = this.$route.params.author;
      get(`/api/user/${author}`)
        .then((response) => {
          if (response.isSuccess) {
            this.author = response.data.author;
            this.freets = response.data.freets;
            this.refreets = response.data.refreets;
            this.likes = response.data.likes;
            this.followers = response.data.followers;
            this.following = response.data.following;
            this.hasPrivateInformation = response.data.hasPrivateInformation;
            this.followingStatus = response.data.followingStatus;
            this.followsCurrentUser = response.data.followsCurrentUser;
            this.isAuthorExists = true; 

            // if there is no private info, make sure the active tab is freets
            !this.hasPrivateInformation && this.setCurrentTab('freets');

          } else {
            // if there is any error, then this user does not exist
            this.isAuthorExists = false;
          }
          // signal that the page has stopped loading
           this.loading = false;        
        });
    },

    freetModifiedListener() {
      // when a freet is modified, ping the db to get author details in case
      // there were any changes to the user profile and freets
      this.getAuthorDetails();
    },

    isCurrentTab(tab) {
      return this.$route.path.includes(tab);
    },

    withoutUrlLastPath() {
      const current = window.location.pathname;
      let toRemove;
      if (current.includes("refreets")) toRemove = "refreets";
      if (current.includes("likes")) toRemove = "likes";
      if (current.includes("followers")) toRemove = "followers";
      if (current.includes("following")) toRemove = "following";

      if (toRemove !== undefined) {
        return current.substring(0, current.lastIndexOf(toRemove) - 1);

      } else if (current.charAt(current.length - 1) === "/") {
        return current.substring(0, current.length - 1);

      } else {
        return current;
      }
    },

    setCurrentTab(tab) {
      if (this.activeTab === tab) {
        return;
      }
      this.activeTab = tab;

      // update the url
      const noExtension = this.withoutUrlLastPath();
      if (tab === "freets") {
        history.replaceState({}, null, noExtension);

      } else {
        history.replaceState({}, null, `${noExtension}/${tab}`);
      }
    }
  },

  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      this.$router.go();
    }
  },

  mounted() {
    if (this.isCurrentTab("refreets")) {
      this.setCurrentTab("refreets");

    } else if (this.isCurrentTab("likes")) {
      this.setCurrentTab("likes");

    } else if (this.isCurrentTab("followers")) {
      this.setCurrentTab("followers");

    } else if (this.isCurrentTab("following")) {
      this.setCurrentTab("following");
    
    } else {
      this.setCurrentTab("freets");
    }
  },

  created() {   
    // need to render page differently when it is for the current user
    this.getAuthorDetails();

    eventBus.$on('update-freets', this.freetModifiedListener);
    eventBus.$on('set-active-tab', this.setCurrentTab);

    // when a user follows or unfollows someone, update the profile
    eventBus.$on('update-profile', this.getAuthorDetails);
  },

  beforeDestroy() {
    // unregister all eventBus listeners
    eventBus.$off('update-freets', this.freetModifiedListener);
    eventBus.$off('set-active-tab', this.setCurrentTab);
    eventBus.$off('update-profile', this.getAuthorDetails);
  }
}
</script>

<style scoped>
.profile-container {
  width: 100%;
}

.profile-details-section  {
  width: 100%;
}

.not-exist {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

</style>