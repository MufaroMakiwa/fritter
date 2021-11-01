<template>
  <section class="pri-stng-container">
    <div class="privacy-section">
      <span class="section-title">Account activity</span>

      <div class="section-controls">
        <label class="toggle-container" for="toggle">
          <input 
            type="checkbox" 
            class="toggle-input" 
            id="toggle" 
            :checked="isPrivateAccount"
            @change="updatePrivacy($event)"/>
          <div class="toggle-fill"></div>
        </label>

        <span class="summary">
          Make you account private to only your followers.
        </span>
      </div>

      <span class="section-note">
        By making your accout private, only your followers will be able to see your likes,
        the people you follow and the people that follow you. 
      </span>

    </div>

    <div class="privacy-section">
      <span class="section-title">Delete your account</span>

      <span class="summary">
        Deleting your account will erase all your data which including user 
        information, freets, upvotes and refreets.
      </span>

      <span class="update-link" @click="deleteAccount">
        Proceed to delete account
      </span>
    </div>

  </section>
</template>

<script>
import { delete_, put } from '../utils/crud-helpers';

export default {
  name: "PrivacySettings",

  computed: {
    isPrivateAccount() {
      return this.$store.getters.isPrivateAccount;
    }
  },

  methods: {
    deleteAccount() {
      if (confirm(
        "Once your account has been deleted, any of your data cannot be recovered.",
      )) {
        delete_('/api/user')
          .then(response => {
            if (response.isSuccess) {
              this.$store.dispatch("unauthenticateUser");
              this.$router.push({name: "Login"}); 

            } else {
              // no error expected here. The unauthenticated error is caught
              // in App.vue
            }
          });
      }
    },

    setPrivacy(value) {
      put('/api/user', { isPrivateAccount: value })
        .then(response => {
          if (response.isSuccess) {
            this.$store.dispatch('updateUser', response.data.user);
          }
        })

    },

    updatePrivacy(event) {
      if (this.isPrivateAccount) {
        if (confirm("By turning off privacy mode, all pending follow requests will be automatically accepted.")) {
          this.setPrivacy(false);
          
        } else {
          // if user declines keep the checkbox checked
          event.target.checked = true;
        }
      } else {
        this.setPrivacy(true);
      }
    }
  }
}
</script>

<style scoped>
.pri-stng-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.privacy-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1rem 0;
  border-bottom: 1px solid lightgray;
}

.privacy-section:first-of-type {
  padding-top: 0;
}

.section-title {
  font-weight: bold;
  margin-bottom: 1rem;
  transition: all 0.3s;
  color: black;
}

.section-note {
  color: gray;
  font-size: 0.9rem;
  margin-top: 2rem;
}

.update-link {
  margin-top: 2rem;
  color: red;
  cursor: pointer;
}

.summary {
  color: gray;
  text-align: justify;
  text-justify: inter-word;
  word-break: normal;
}

.update-link:hover {
  text-decoration: underline;
}

.section-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.toggle-container {
  --width: 36px;
  --padding: 4px;
  --height: calc(var(--width) / 2);
  --slider-radius: calc(var(--height) / 2);
  --slider-width: calc(var(--height));
  --outer-height: calc(var(--height) + var(--padding) * 2);
  --outer-width: calc(var(--width) + var(--padding) * 2);
  --outer-radius: calc(var(--slider-radius) + var(--padding) * 2);
  display: inline-block;
  cursor: pointer;
  margin-right: 2rem;
}

.toggle-input {
  display: none;
}

.toggle-fill {
  position: relative;
  width: var(--outer-width);
  height: var(--outer-height);
  border-radius: var(--outer-radius);
  background-color: lightgray;
  transition: background 0.3s;
}

.toggle-fill::after {
  content: "";
  position: absolute;
  top: var(--padding);
  left: var(--padding);
  bottom: var(--padding);
  height: var(--height);
  width: var(--height);
  background: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  border-radius: var(--slider-radius);
  transition: transform 0.3s;
}

.toggle-input:checked ~ .toggle-fill {
  background-color: var(--theme-color);
}

.toggle-input:checked ~ .toggle-fill::after {
  transform: translateX(var(--height));
}

</style>

