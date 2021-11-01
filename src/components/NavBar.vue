<template>
  <div class="navbar-container">
    <nav>
      <h1 @click="renderPage('Home')" class="app-name">Fritter</h1>
 
      <input 
        name="author" 
        type="search"
        class="nav-input"
        value autocomplete="off"
        v-model="author"
        @keyup.enter="handleSubmit($event)"
        placeholder="Search Fritter"/>   

      <div v-if="!isSignedIn">
        <button @click="logIn">Log in</button>
        <button @click="register">Sign up</button>
      </div>

      <div v-else class="nav-profile">
        <div 
          :class="['user-container', displayMenu ? 'focused' : '']"
          tabindex="0"
          @click="toggleMenu($event)"
          @focusout="hideMenu">

          <div class="profile-icon">
            <font-awesome-icon icon="user-circle" class="icon"/>
          </div>
    
          <span class="username overflow-text">{{username}}</span>
        </div>

        <NotificationIcon 
          :class="['profile-icon', isNotificationPage ? 'selected' : '']"
          @click.native="renderPage('Notifications')" />

        <button @click.stop="isCreateFreetDialogOpen= true">Create Freet</button>
        <transition name="fade">
          <CreateFreetDialog v-if="isCreateFreetDialogOpen"/>
        </transition>

        <transition name="fade">
          <ProfileMenu v-if="displayMenu" class="menu" :username="username"/>
        </transition>
      </div>
    </nav>
  </div> 
</template>

<script>
import NotificationIcon from './NotificationIcon';
import CreateFreetDialog from './CreateFreetDialog';
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

    canSubmit() {
      return this.author.trim().length > 0;
    },

    isNotificationPage() {
      return this.$route.name === "Notifications";
    }
  },

  components: {
    NotificationIcon, ProfileMenu, CreateFreetDialog
  },

  methods: {
    isSameProfileRoute(author) {
      const currentAuthor = this.$route.params.author;
      return currentAuthor !== undefined && author === currentAuthor;
    },

    signOut() {
      delete_('/api/user/session')
        .then(response => {
          if (response.isSuccess) {
            this.$store.dispatch("unauthenticateUser");
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

    navigate(author) {
      if (!this.isSameProfileRoute(author)) {
        this.$router.push({ 
          name: "Profile",
          params: { author }
        });
      } else {
        this.$router.go();
      }
    },

    handleSubmit(event) {
      // remove focus
      event.target.blur();

      if (!this.canSubmit) {
        return;
      }

      // navigate to the profile page
      this.navigate(this.author.trim());
      
      // clear search query 
      this.author = ""; 
    },

    goToProfile(username) { 
      this.navigate(username);   
    },

    logIn() {
      this.$router.push({ name: "Login" });
    },
    
    register() {
      this.$router.push({ name: "Register" });
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

    dialogListener() {
      this.isCreateFreetDialogOpen = false;
    }
  },

  created() {
    eventBus.$on('navigate-to-profile', this.goToProfile);
    eventBus.$on('logout-menu-selected', this.signOut);
    eventBus.$on('navigate-to-settings', this.goToSettings);
    eventBus.$on('close-freet-dialog', this.dialogListener);
  },

  beforeDestroy() {
    eventBus.$off('navigate-to-profile', this.goToProfile);
    eventBus.$off('logout-menu-selected', this.signOut);
    eventBus.$off('navigate-to-settings', this.goToSettings);
    eventBus.$off('close-freet-dialog', this.dialogListener);
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

nav .icon  {
  color: gray;
}

nav button {
  height: var(--element-size);
  border-radius: calc(var(--element-size) / 2);
  outline: none;
}

.app-name {
  margin: 0;
  padding: 0;
  transition: all 0.3s;
  color: var(--theme-color);
}

.app-name:hover {
  color: var(--button-color-hover);
  cursor: pointer;
}


.nav-input {
  padding: 12px 16px;
  margin: 0 1rem;
  transition: all 0.3s;
  height: var(--element-size);
  max-width: 400px;
  flex-grow: 1;
  background-color: whitesmoke;
  border: 1px solid lightgray;
  border-radius: 4px;
  font-size: 0.9rem
}


.nav-profile {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
}

.nav-profile .profile-icon {
  font-size: 1.5rem;
  width: var(--element-size);
  height: var(--element-size);
  background-color: whitesmoke;
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
  padding-right: 1rem;
  border-radius: calc(var(--element-size) / 2);
  border: 1px solid whitesmoke;
  transition: all 0.3s;
  outline: none;
  margin: 0 0.5rem;
}

.user-container .username {
  margin-left: 0.5rem;
  max-width: 150px;
}

.nav-profile .user-container:hover {
  background-color: whitesmoke;
  cursor: pointer;
}

.nav-profile .user-container.focused {
  background-color: var(--input-color-hover);
}

.nav-profile .user-container .profile-icon {
  background-color: whitesmoke;
  margin: 0;
}

.nav-profile .menu {
  position: absolute;
  top: 110%;
  right: 0;
}

</style>