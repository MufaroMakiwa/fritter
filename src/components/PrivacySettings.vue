<template>
  <section class="pri-stng-container">
    <div class="privacy-section">
      <span class="sub-section-title">Account activity</span>

      <div class="section-controls">
        <div 
          :class="['toggle-container', isPrivateAccount ? 'checked' : '']"
          @click="updatePrivacy">
          <div class="toggle-fill"></div>
        </div>

        <span class="summary black">
          Make you account private to only your followers.
        </span>
      </div>

      <span class="section-note">
        By making your accout private, only your followers will be able to see your likes, refreets,
        following and followers. You account will also not be suggested to other users. 
      </span>

    </div>

    <div class="privacy-section">
      <span class="sub-section-title">Delete your account</span>

      <span class="summary">
        Deleting your account will erase all your data which including user 
        information, freets, upvotes and refreets.
      </span>

      <span class="update-link" @click="deleteAccount">
        Proceed to delete account
      </span>
    </div>

    <ConfirmDialog ref="confirm"/>
  </section>
</template>

<script>
import { delete_, put } from '../utils/crud-helpers';
import ConfirmDialog from './ConfirmDialog';


export default {
  name: "PrivacySettings",

  computed: {
    isPrivateAccount() {
      return this.$store.getters.isPrivateAccount;
    }
  },

  components: {
    ConfirmDialog
  },

  methods: {
    async deleteAccount() {
      if (!await this.$refs.confirm.open(
        "Delete your account?",
        "This can't be undone and all your information which includes freets, refreets, like, followers and following will be lost",
        "Delete"
      )) {
        return;
      }

      delete_('/api/user')
        .then(response => {
          if (response.isSuccess) {
            this.$router.push({name: "Login"}); 

          } else {
            // no error expected here. The unauthenticated error is caught
            // in App.vue
          }
        });
    },

    setPrivacy(value) {
      put('/api/user', { isPrivateAccount: value })
        .then(response => {
          if (response.isSuccess) {
            this.$store.dispatch('updateUser', response.data.user);
          }
        })

    },

    async updatePrivacy() {
      if (this.isPrivateAccount) {
        if (await this.$refs.confirm.open(
          "Turn off private mode?",
          "By turning off private mode, any pending follow requests you received will be automatically accepted.",
          "Turn off",
          { isWarning: false }
        )) {
          this.setPrivacy(false);
        }
      } else {

        if (await this.$refs.confirm.open(
          "Turn on private mode?",
          "Your account will not be suggested to users who do not follow you and your freets will not show up on the Discover page.",
          "Turn on",
           { isWarning: false }
        )) {
          this.setPrivacy(true);
        }
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

.sub-section-title {
  font-weight: bold;
  margin-bottom: 1rem;
  transition: all 0.3s;
  color: black;
}

.section-note {
  color: gray;
  margin-top: 1.5rem;
  text-justify: inter-word;
  text-align: justify;
  word-break: normal;
}

.update-link {
  margin-top: 1.5rem;
  color: red;
  cursor: pointer;
}

.summary {
  color: gray;
  text-align: justify;
  text-justify: inter-word;
  word-break: normal;
}

.summary.black {
  color: black;
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
  margin-right: 1.5rem;
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

.toggle-container.checked .toggle-fill {
  background-color: var(--theme-color);
}

.toggle-container.checked .toggle-fill::after {
  transform: translateX(var(--height));
}

</style>

