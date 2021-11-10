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
        <h3 class="section-title">{{ sectionTitle }}</h3>
        <FreetsList 
          v-if="activeTab === 'freets'"
          :freets="freets"
          emptyTitle="No freets to display, yet!"
          :emptySummary="emptyContentMessage"/>

        <FreetsList 
          v-if="activeTab === 'refreets'"
          :freets="refreets"
          emptyTitle="No freets to display, yet!"
          :emptySummary="emptyContentMessage"/>

        <FreetsList 
          v-if="activeTab === 'likes'"
          :freets="likes"
          emptyTitle="No freets to display, yet!"
          :emptySummary="emptyContentMessage"/>

        <UsersList 
          v-if="activeTab === 'followers'"
          :users="followers"
          :displayRemoveButton="isCurrentUser"
          :emptyTitle="noUsersTitle"
          :emptySummary="emptyContentMessage"/>

        <UsersList 
          v-if="activeTab === 'following'"
          :users="following"
          :displayNoContentDiscover="isCurrentUser"
          :emptyTitle="noUsersTitle"
          :emptySummary="emptyContentMessage"/>    
      </div>   
    </div>

    <NoContent 
      v-else
      title="This account doesn't exist!"
      summary="Try searching for another." />

  </MainPageTemplate>
</template>

<script>
import MainPageTemplate from '../components/MainPageTemplate';
import ProfileHeader from '../components/ProfileHeader';
import FreetsList from '../components/FreetsList';
import UsersList from '../components/UsersList';
import NoContent from '../components/NoContent';
import { get } from '../utils/crud-helpers';
import { eventBus } from '../main';

export default {
  name: "Profile",

  components: {
    MainPageTemplate, FreetsList, ProfileHeader, UsersList, NoContent,
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
    },

    noUsersTitle() {
      switch (this.activeTab) {
        case "following":
          return this.isCurrentUser
                  ? "You are not following anyone, yet!"
                  : `${this.author.username} is not following anyone, yet!`;

        case "followers":
          return this.isCurrentUser
                  ? "You do not have any followers, yet!"
                  : `${this.author.username} does not have any followers, yet!`;

        default:
          // should not get here
          return ''
      }
    },

    emptyContentMessage() {
      switch (this.activeTab) {
        case "refreets":
          return this.isCurrentUser 
                  ? "When you refreet other freets, you will see them here."
                  : `When ${this.author.username} refreets other freets, you will see them here.`

        case "likes":
          return this.isCurrentUser 
                  ? "When you like other freets, you will see them here."
                  : `When ${this.author.username} likes other freets, you will see them here.`

        case "followers":
          return this.isCurrentUser 
                  ? "When you do, you will see them listed here."
                  : `When they do, you will see them listed here.`

        case "following":
          return this.isCurrentUser 
                  ? "When you do, you see them listed here and also see their freets and refreets on your feed."
                  : `When they do, you will see them listed here.`

        default: 
          return this.isCurrentUser
                  ? "When you post freets, you will see them here."
                  : `When ${this.author.username} posts freets, you will see them here.`
      }
    }
  },

  methods: {
    goToDiscover() {
      this.$router.push({ name: "HomeDiscover" });
    },

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
    eventBus.$on('toggle-discover', this.goToDiscover);

    // when a user follows or unfollows someone, update the profile
    eventBus.$on('update-profile', this.getAuthorDetails);
  },

  beforeDestroy() {
    // unregister all eventBus listeners
    eventBus.$off('update-freets', this.freetModifiedListener);
    eventBus.$off('set-active-tab', this.setCurrentTab);
    eventBus.$off('update-profile', this.getAuthorDetails);
    eventBus.$off('toggle-discover', this.goToDiscover);
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

</style>