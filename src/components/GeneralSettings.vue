<template>
  <div class="gen-stng-container">
    <section class="update-section">
      <span class="update-section-title">Username</span>

      <div class="update-details">
        <span class="summary">{{ currentUsername }} <i>(Current)</i></span>

        <span 
          class="update-link" 
          v-if="!username.updating"
          @click="username.updating = true">
          Update Username
        </span>

        <div v-else class="update-field">
          <CredentialInputField 
            :displayLabel="false"
            :autofocus="true"
            :error="username.error"
            placeholder="Enter new username"
            v-model="username.value"/>

          <div class="modifiers">   
            <button @click="updateUsername" :disabled="!usernameUpdated">Update Username</button>        
            <button @click="username.updating = false" class="cancel">Cancel</button>
          </div>
        </div>

      </div>
    </section>

    <section class="update-section">
      <span class="update-section-title">Password</span>

      <div class="update-details">
        <span 
          class="update-link" 
          v-if="!password.updating"
          @click="password.updating = true">
          Update Password
        </span>

        <div v-else class="update-field">
          <CredentialInputField 
            :displayLabel="false"
            :error="password.error"
            :autofocus="true"
            v-model="password.value"
            placeholder="Enter new password"
            :isPasswordField="true"/>

          <div class="modifiers">   
            <button @click="updatePassword" :disabled="!passwordUpdated">Update Password</button>        
            <button @click="password.updating = false" class="cancel">Cancel</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import CredentialInputField from '../components/CredentialInputField';
import { validateUsername, validatePassword } from '../utils/validator';
import { put } from '../utils/crud-helpers';
import { eventBus } from '../main';

export default {
  name: "GeneralSettings",

  props: {
    currentUsername: String,
  },

  components: {
    CredentialInputField
  },

  data () {
    return {
      username: {
        updating: false,
        value: "",
        error: ""
      },

      password: {
        updating: false,
        value: "",
        error: ""
      }
    }
  },

  computed: {
    usernameUpdated() {
      return this.username.value.trim().length !== 0
             && this.username.value.trim() !== this.currentUsername;
    },

    passwordUpdated() {
      return this.password.value !== "";
    },
  },


  methods: {

    // this will be true if any of the inputs has an error set on it
    hasValidationError(field) {
      return field.error.length !== 0;
    },


    updateUsername() {
      // validate username
      this.usernameUpdated && (this.username.error = validateUsername(this.username.value));

      // if there is an error or no update made
      if (!this.usernameUpdated || this.hasValidationError(this.username)) {
        return;
      }

      const body = { username: this.username.value.trim() };
      this.updateProfile(body, this.updateUsernameCallback);
    },


    updatePassword() {
      // validate username
      this.passwordUpdated && (this.password.error = validatePassword(this.password.value));

      // if there is an error or no update made
      if (!this.passwordUpdated || this.hasValidationError(this.password)) {
        return;
      }

      const body = { password: this.password.value };
      this.updateProfile(body, this.updatePasswordCallback);
    },


    async updateProfile(body, callback) {
      const response = await put('/api/user', body);
      if (response.isSuccess) {
          this.$store.dispatch("updateUser", response.data.user);
          callback();
      
      } else {
        this.handleErrors(response);
      }
    },


    updateUsernameCallback() {
      this.username = { value: "", error: "", updating: false };
      eventBus.$emit('display-toast', "You updated your username");
    },


    updatePasswordCallback() {
      this.password = { value: "", error: "", updating: false };
      eventBus.$emit('display-toast', "You updated your password");
    },


    handleErrors(response) {
      if (response.data.error.username) {
        this.username.error = response.data.error.username;
      } 
      // update password error
      if (response.data.error.password) {
        this.password.error = response.data.error.password;
      }

      // no other errors expected. Unath error is handled in App.vue
    },
  },
}
</script>

<style scoped>
.gen-stng-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.update-section {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  border-bottom: 1px solid lightgray;
  padding: 1rem 0;
}

.update-section:first-of-type {
  padding-top: 0;
}

.update-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  flex-grow: 1;
}

.update-details .summary {
  font-weight: bold;
  margin-bottom: 1rem;
}

.update-details span i {
  color: gray;
  font-weight: 400;
}

.update-section-title {
  width: 200px;
}

.update-link {
  color: var(--theme-color);
}

.update-link:hover {
  text-decoration: underline;
  cursor: pointer;
}

.update-field {
  width: 100%;
}

.update-field .modifiers {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
  width: 100%;
}
</style>