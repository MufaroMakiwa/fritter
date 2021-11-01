<template>
  <header>
    <div class="profile-details">
      <FreetIcon :size="100" :username="username" backgroundColor="white"/>
      <div class="header-main">
        <h1>{{ username }}</h1>
        <span class="header-user-meta" v-if="isAuthorExists">Joined {{ dateJoined }}</span>
      </div>

      <div v-if="!isCurrentUser && isSignedIn && isAuthorExists">
        <FollowButton 
          :followingStatus="followingStatus"
          :username="username"/>
      </div>

      <div v-else-if="isCurrentUser">
        <button 
          class="profile-header-button edit-profile-button"
          @click="goToSettings">
          Edit Profile
        </button>
      </div>
    </div>
    
    <div class="tab-navigator" v-if="isAuthorExists && hasPrivateInformation">
      <div 
        @click="setActiveTab('freets')"
        :class="['tab', activeTab === 'freets' ? 'active' : '']">
        <span class="title">Freets</span>
        <span class="count">{{ freetsCount }}</span>
      </div>

      <div 
        @click="setActiveTab('refreets')"
        :class="['tab', activeTab === 'refreets' ? 'active' : '']">
        <span class="title">Refreets</span>
        <span class="count">{{ refreetsCount }}</span>
      </div>

      <div 
        @click="setActiveTab('likes')"
        :class="['tab', activeTab === 'likes' ? 'active' : '']">
        <span class="title">Likes</span>
        <span class="count">{{ likesCount }}</span>
      </div>

      <div 
        @click="setActiveTab('followers')"
        :class="['tab', activeTab === 'followers' ? 'active' : '']">
        <span class="title">Followers</span>
        <span class="count">{{ followersCount }}</span>
      </div>

      <div 
        @click="setActiveTab('following')"
        :class="['tab', activeTab === 'following' ? 'active' : '']">
        <span class="title">Following</span>
        <span class="count">{{ followingCount }}</span>
      </div> 
    </div>
  </header>
</template>

<script>
import FreetIcon from './FreetIcon';
import { formattedDate } from '../utils/utilities';
import { eventBus } from '../main';
import FollowButton from './FollowButton';

export default {
  name: "ProfileHeader",

  components: {
    FreetIcon, FollowButton
  },

  props: {
    author: Object,
    isAuthorExists: Boolean,
    isCurrentUser: Boolean,
    activeTab: String,
    freetsCount: {
      default: 0,
      type: Number,
    },
    refreetsCount: {
      default: 0,
      type: Number,
    },
    likesCount: {
      default: 0,
      type: Number,
    },
    followersCount: {
      default: 0,
      type: Number,
    },
    followingCount: {
      default: 0,
      type: Number,
    },
    hasPrivateInformation: {
      default: true,
      type: Boolean,
    },
    followingStatus: {
      default: "NONE",
      type: String
    }
  },

  computed: {

    dateJoined() {
      return this.isAuthorExists ? formattedDate(this.author.dateJoined) : '';
    },

    isSignedIn() {
      return this.$store.getters.isSignedIn;
    },

    username() {
      if (!this.isAuthorExists) {
        return this.$route.params.author;
      } else {
        return this.author.username;
      }
    }
  },

  methods: {
    setActiveTab(tab) {
      eventBus.$emit('set-active-tab', tab);
    },

    goToSettings() {
      eventBus.$emit('navigate-to-settings');
    }
  }
}
</script>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  border-radius: 4px; 
}

header .profile-details {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 2rem;
  width: 100%;
  background-color: var(--input-color-hover);
}

.header-main {
  margin-left: 24px;
  flex-grow: 1
}

.header-user-meta {
  color: gray
}

.header-main h1 {
  padding: 0;
  margin: 0
}

.edit-profile-button {
  border: 1px solid lightgray;
  background-color: whitesmoke;
  color: black;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

.edit-profile-button:hover {
  background-color: lightgray;
}

.tab-navigator {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: white;
  width: 100%;
}

.tab-navigator .tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  transition: all 0.3s;
  padding: 0.5rem 0;
  border-bottom: 3px solid white;
}

.tab-navigator .tab:hover {
  cursor: pointer;
  background-color: whitesmoke;
  border-bottom: 3px solid var(--button-color-disabled);
}

.tab-navigator .tab > * {
  color: gray
}

.tab-navigator .tab .count {
  font-size: 1.25rem;
  font-weight: bold;
}

.tab-navigator .tab.active {
  border-bottom: 3px solid var(--theme-color);
  background-color: white;
}

.tab-navigator .tab.active > * {
  color: var(--theme-color);
}
</style>