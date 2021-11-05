<template>
  <div class="profile-menu">
    <section class="option profile-link" @click="goToProfile">
      <font-awesome-icon icon="user-circle" class="icon menu-profile-icon "/>
      <div class="summary">
        <span class="username overflow-text">{{ username }}</span>
        <span class="instruction">See your profile</span>
      </div>
    </section>

    <hr noshade size="1" color="lightgray"/>
    <section class="menu-options">
      <div class="option" @click="goToSettings">
        <font-awesome-icon icon="cog" class="icon option-icon"/>
        <span class="option-title">Settings</span>
      </div>

      <div class="option" @click="logout">
        <font-awesome-icon icon="sign-out-alt" class="icon option-icon"/>
        <span class="option-title">Log out</span>
      </div>
    </section>
  </div>
</template>

<script>
import { eventBus } from '../main';

export default {
  name: "ProfileMenu",

  props: {
    username: String
  },

  methods: {
    goToSettings() {
      eventBus.$emit("navigate-to-settings");
    },

    goToProfile() {
      eventBus.$emit("navigate-to-profile", this.username);
    },

    logout() {
      eventBus.$emit("logout-menu-selected");
    },
  }
}
</script>

<style scoped>
.profile-menu {
  width: 300px;
  padding: 1rem;
  border: none;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
}

.option {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0.5rem;
  transition: all .3s;
  border-radius: 4px;
  width: 100%;
}

.option:hover {
  background-color: whitesmoke;
  cursor: pointer;
}

.profile-link .menu-profile-icon {
  font-size: 2.5rem;
}

.profile-link .summary {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-left: 1rem;
}

.profile-link .summary .username {
  font-weight: bold;
}

.profile-link .summary .instruction {
  color: gray
}

.menu-options {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.menu-options .option-icon {
  font-size: 1.5rem;
}

.menu-options .option .option-title {
  margin-left: 1rem;
  padding: 0.5rem;
  color: gray;
}

</style>