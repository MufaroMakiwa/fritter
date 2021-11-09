<template>
  <form @submit.prevent="authenticateUser" class="card">
    <h2 class="section-title">{{ title }}</h2>

    <span v-if="hasEntryError" class="input-error">{{ entryError }}</span>
    
    <CredentialInputField 
      name="username" 
      label="Username"
      v-model="username.value"
      :error="username.error"
      :autofocus="true"/>
      
    <CredentialInputField 
      name="password" 
      label="Password"
      class="form-input-margin"
      :isPasswordField="true"
      v-model="password.value"
      :error="password.error"/>
      
    <input type="submit" :value="title"/>
  </form>
</template>

<script>
import CredentialInputField from './CredentialInputField';
import { post } from '../utils/crud-helpers';
import { validateUsername, validatePassword } from '../utils/validator';


export default {
  name: "EntryForm",

  data() {
    return {
      password: {
        value: "",
        error: ""
      },

      username: {
        value: "",
        error: ""
      },

      // this will not be empty if there is any other error that is is not related to 
      // username or password
      entryError: ""
    }
  },

  components: {
    CredentialInputField
  },

  props: {
    title: String,
    endpoint: String,
  },

  computed: {
    canSubmit() {
      return this.username.error.length === 0 && this.password.error.length === 0;
    },

    hasEntryError() {
      return this.entryError.length !== 0;
    }
  },

  methods: {
    async authenticateUser() {
      // validate credentials from user input
      this.validateCredentials();

      if (!this.canSubmit) {
        return;
      }

      // create request body and post
      const body = {
        username: this.username.value.trim(), 
        password: this.password.value
      }

      // get the response 
      const response = await post(this.endpoint, body);
      if (response.isSuccess) {
        this.resetFields();
        this.$router.push({name: "Home"});
      } else {
        this.handleErrors(response);
      }
    },

    resetFields() {
      this.password = {value: "", error: ""};
      this.username = {value: "", error: ""};
    },

    validateCredentials() {
      this.username.error = validateUsername(this.username.value);
      this.password.error = validatePassword(this.password.value);
    },

    handleErrors(response) {
      let hasEntryError = true;

      // update username error
      if (response.data.error.username) {
        this.username.error = response.data.error.username;
        hasEntryError = false;
      } 

      // update password error
      if (response.data.error.password) {
        this.password.error = response.data.error.password;
        hasEntryError = false;
      } 

      if (hasEntryError) {
        this.entryError = response.data.error;
      }
    },
  }
}
</script>

<style scoped>

form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: white;
  margin-bottom: 1rem;
  padding: 1.5rem;
}

h2 {
  color: black;
}

input[type="submit"] {
  background-color: rgba(0, 0, 0, 0.05);
  font-size: 100%;
  line-height: 200%;
  font-weight: bold;
  border: 1px solid lightgray;
  border-radius: 4px;
  margin-top: 1.5rem;
  padding: 8px;
  transition: all 0.3s;
}

input[type="submit"]:hover {
  cursor: pointer;
  background-color: var(--input-color-hover);
}

.form-input-margin {
  margin-top: 1rem;
}
</style>