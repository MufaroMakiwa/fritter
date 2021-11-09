<template>
  <div v-if="loading" class="loader-container">
    <div class="loading"></div>
  </div>

  <div class="page-container" v-else>
    <NavBar />

    <Toast 
      v-if="toast.isDisplayed"
      :message="toast.message" />

    <main>
      <section :class="['main-section', displaySidebar ? 'padded' : '']">
        <slot></slot>
      </section>

      <section class="suggestions-section" v-if="displaySidebar">
        <FollowSuggestions />
      </section>
    </main>
  </div>
</template>

<script>
import NavBar from "./NavBar";
import Toast from "./Toast";
import { eventBus } from '../main';
import FollowSuggestions from './FollowSuggestions';


export default {
  name: "MainPageTemplate",

  components: {
    NavBar, Toast, FollowSuggestions
  },

  data() {
    return {
      toast: {
        isDisplayed: false,
        message: "",
        timeout: null
      },
    }
  },

  props: {
    loading: {
      default: false,
      type: Boolean
    },

    displaySidebar: {
      default: false,
      type: Boolean
    }
  },

  methods: {
    displayToastListener(message) {
      // clear the previous toast timeout
      clearTimeout(this.toast.timeout);

      // display the toast
      this.toast = { ...this.toast, isDisplayed: true, message: message };
      
      // hide toast after 2 seconds
      this.toast.timeout = setTimeout(() => {
        this.toast = { isDisplayed: false, message: "" };
      }, 2000);
    },
  },

  created() {
    eventBus.$on("display-toast", this.displayToastListener);
  },

  beforeDestroy() {
    eventBus.$off("display-toast", this.displayToastListener);
  }
}
</script>

<style>
.page-container {
  --sidebar-width: 260px;
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

main {
  flex-grow: 1;
  width: 100%;
  max-width: var(--max-page-width);
  margin-top: var(--nav-bar-height);
  display: flex;
  flex-direction: row;
  padding: var(--page-padding);
  align-items: flex-start;
  justify-content: flex-end;
}

.main-section {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: flex-start;
  justify-content: flex-start;
}

.main-section.padded {
  margin-right: var(--page-padding);
}

.suggestions-section {
  width: var(--sidebar-width);
  flex-shrink: 0;
  position: sticky;
  top: calc(var(--nav-bar-height) +  var(--page-padding));
  bottom: 0;
}

.loader-container {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.loader-container .loading {
  width: 50px;
  height: 50px;
  background-color: var(--theme-color);
  border-radius: 50%;
  animation: loader 0.3s ease infinite alternate;
}

@keyframes loader {
  to {
    transform: scale(2);
  }
}

.freet-icon-container {
  margin-right: 1.5rem;
}

/* 
This style applies to both the follow button component and the edit profile
button in the profile header
 */
.profile-header-button {
  height: 36px;
  width: 120px;
  border-radius: 18px;
  outline: none; 
  transition: all 0.3s;
  text-align: center;
}

.profile-header-button.medium {
  width: 100px;
  height: 32px;
  border-radius: 16px;
}

.profile-header-button.small {
  width: 75px;
  height: 32px;
  border-radius: 16px;
}

.fade-enter-active {
  animation: fade-in .2s linear;
}

.fade-leave-active {
  animation: fade-in .2s linear reverse;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@media screen and (max-width: 900px) {
  .page-container {
    --sidebar-width: 240px;
  }
}

@media screen and (max-width: 800px) {
  .main-section {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .main-section.padded {
    margin-right: 0;
  }

  .suggestions-section {
    display: none;
  }
}
</style>