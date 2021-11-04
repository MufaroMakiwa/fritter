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
      <slot></slot>
    </main>
  </div>
</template>

<script>
import NavBar from "./NavBar";
import Toast from "./Toast";
import { eventBus } from '../main';

export default {
  name: "MainPageTemplate",

  components: {
    NavBar, Toast
  },

  data() {
    return {
      toast: {
        isDisplayed: false,
        message: "",
      }
    }
  },

  props: {
    loading: {
      default: false,
      type: Boolean
    }
  },

  methods: {
    displayToastListener(message) {
      // display the toast
      this.toast = { isDisplayed: true, message: message };
      
      // hide toast after 2 seconds
      setTimeout(() => {
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
  flex-direction: column;
  padding: var(--page-padding);
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
</style>