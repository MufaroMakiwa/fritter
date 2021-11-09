<template>
  <div class="navbar-container">
    <nav>
      <h1 @click="goToHome()" class="app-name">Fritter</h1>
 
      <SearchBar />  

      <div v-if="!isSignedIn">
        <button @click="logIn">Log in</button>
        <button @click="register">Sign up</button>
      </div>

      <div v-else class="nav-profile">
        <div 
          :class="['user-container', displayMenu ? 'focused' : '', 'tooltip']"
          data-label="Account"
          tabindex="0"
          @click="toggleMenu($event)"
          @focusout="hideMenu">

          <div class="profile-icon">
            <font-awesome-icon icon="user-circle" class="icon"/>
          </div>
    
          <span class="username overflow-text">{{username}}</span>
        </div>

        <NotificationIcon 
          :class="['profile-icon', isNotificationPage ? 'selected' : '', 'tooltip']"
          @click.native="goToNotifications()" 
          data-label="Notifications"/>

        <button @click.stop="isCreateFreetDialogOpen= true">Create Freet</button>
        
        <CreateFreetDialog v-model="isCreateFreetDialogOpen"/>
        
        <transition name="fade">
          <ProfileMenu v-if="displayMenu" class="menu" :username="username"/>
        </transition>

        <ConfirmDialog ref="confirm"/>
      </div>
    </nav>
  </div> 
</template>

<script>
import NotificationIcon from './NotificationIcon';
import CreateFreetDialog from './CreateFreetDialog';
import ConfirmDialog from './ConfirmDialog';
import SearchBar from './SearchBar';
import { delete_ } from '../utils/crud-helpers';
import { eventBus } from '../main';
import ProfileMenu from './ProfileMenu';


export default {
  name: "NavBar",

  data() {
    return {
      author: "",
      isCreateFreetDialogOpen: false,
      displayMenu: false
    }
  },

  computed: {
    username() {
      const user = this.$store.getters.user;
      return user !== null ? user.username : '';
    },

    isSignedIn() {
      return this.$store.getters.isSignedIn;
    },

    isNotificationPage() {
      return this.$route.name === "Notifications";
    }
  },

  components: {
    NotificationIcon, ProfileMenu, CreateFreetDialog, ConfirmDialog, SearchBar
  },

  methods: {
    async signOut() {
      const dialogOptions = {
        isWarning: false,
        clickToDismiss: true
      }
      if (!await this.$refs.confirm.open(
        "Log out of Fritter?",
        "This will take you to the sign in page. You can always log in anytime.",
        "Log out",
        dialogOptions
      )) {
        return;
      }

      delete_('/api/user/session')
        .then(response => {
          if (response.isSuccess) {
            this.$router.push({name: "Login"}); 
          } else {
            // no error expected here. The unath error is caught in the
            // App.vue component
          }      
        });
      
    },

    renderPage(name) {
      if (this.$route.name === name) {
        this.$router.go();
      } else {
        // the .catch works to avoid errors that may arise from redirecting
        // that happens in the navigation guard
        // https://newbedev.com/vue-router-uncaught-in-promise-error-redirected-from-login-to-via-a-navigation-guard
        this.$router.push({ name }).catch(() => {});
      }
    },

    goToSettings() {
      this.renderPage("Settings");
    },

    goToHome() {
      // this because of the discover tab which may cause problems when on the home page
      if (this.$route.path.includes("home")) {
        window.location.replace("/home");
      } else {
        this.$router.push({ name: "Home"}).catch(() => {});
      }
    },

    goToNotifications() {
      if (this.$route.path.includes("notifications")) {
        window.location.replace("/notifications");
      } else {
        this.$router.push({ name: "Notifications"}).catch(() => {});
      }
    },

    pushToProfile(author) {
      this.$router.push({ 
        name: "Profile",
        params: { author: author }
      });
    },

    goToProfile(author) {
      if (this.$route.name === "Profile") {
        if (this.$route.params.author === author) {
          window.location.replace(`/${author}`);
        } else {
          this.pushToProfile(author);
        }        
      } else {
        this.pushToProfile(author);
      }
    },

    logIn() {
      this.$router.push({ name: "Login" }).catch(() => {});
    },
    
    register() {
      this.$router.push({ name: "Register" }).catch(() => {});
    },

    toggleMenu(event) {
      this.displayMenu = !this.displayMenu;
      if (!this.displayMenu) {
        event.currentTarget.blur();
      }
    },

    hideMenu() {
      this.displayMenu = false;
    },
  },

  created() {
    eventBus.$on('navigate-to-profile', this.goToProfile);
    eventBus.$on('logout-menu-selected', this.signOut);
    eventBus.$on('navigate-to-settings', this.goToSettings);
    eventBus.$on('search-query', this.goToProfile);
  },

  beforeDestroy() {
    eventBus.$off('navigate-to-profile', this.goToProfile);
    eventBus.$off('logout-menu-selected', this.signOut);
    eventBus.$off('navigate-to-settings', this.goToSettings);
    eventBus.$off('search-query', this.goToProfile);
  }
}
</script>

<style scoped>

.navbar-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: var(--nav-bar-height);
  position: fixed;
  background-color: white;
  top: 0;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.20);
  z-index: 10;
}

nav {
  --element-size: 40px;
  width: 100%;
  height: 100%;
  max-width: var(--max-page-width);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--page-padding);
}

nav button {
  height: var(--element-size);
  border-radius: calc(var(--element-size) / 2);
  outline: none;
}

.app-name {
  transition: all 0.3s;
  color: var(--theme-color);
}

.app-name:hover {
  color: var(--button-color-hover);
  cursor: pointer;
}

.nav-profile {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
}

.tooltip::after {
  content: attr(data-label);
  position: absolute;
  top: 110%;
  font-size: 0.8rem;
  background: rgb(206, 206, 206);
  padding: 4px;
  border-radius: 4px;
  transition: all 0.1s 0.2s;
  transform: scale(0);
  pointer-events: none;
}

.tooltip:hover::after {
  transform: scale(1);
}

.nav-profile .profile-icon {
  font-size: 1.5rem;
  width: var(--element-size);
  height: var(--element-size);
  background-color: var(--theme-lighter);
  border-radius: 50%;
  transition: all 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0 0.5rem;
}

.nav-profile .profile-icon:hover,
.nav-profile .profile-icon.selected {
  background-color: var(--input-color-hover);
}

.nav-profile .user-container {
  display: flex;
  flex-direction: row;
  height: var(--element-size);
  justify-content: center;
  align-items: center;
  border-radius: calc(var(--element-size) / 2);
  border: 1px solid var(--theme-lighter);
  transition: all 0.3s;
  outline: none;
  margin: 0 0.5rem;
}

.user-container .username {
  margin-left: 0.5rem;
  max-width: 150px;
  padding-right: 1rem;
}

.nav-profile .user-container:hover {
  background-color: var(--theme-lighter);
  cursor: pointer;
}

.nav-profile .user-container.focused {
  background-color: var(--input-color-hover);
}

.user-container.focused.tooltip::after {
  display: none;
}

.nav-profile .user-container .profile-icon {
  background-color: var(--theme-lighter);
  margin: 0;
}

.nav-profile .menu {
  position: absolute;
  top: 110%;
  right: 0;
}

</style>