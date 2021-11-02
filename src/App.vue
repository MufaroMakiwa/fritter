<template>
  <router-view/>
</template>

<script>
import axios from 'axios';

export default {
  name: "App",

  async created() { 
    // intercept all axios responses and check for 401 errors when the user token is no longer valid
    axios.interceptors.response.use(
      undefined, 
      async (err) => {
        if (err.response.data.error.userNotFound !== undefined) {
          alert("Your account no longer exists.")
          this.$store.dispatch("unauthenticateUser");
          this.$router.push({ name: "Login" })
        }

        // This error from the server is because the user is not signed in
        // The error handled here may be because the user was logged in in 
        // two tabs and signed out on the other so tab in which the user
        // is still "logged in" does not have updated information about the
        // authentication status
        if (err.response.data.error.auth !== undefined) {
          alert(
            "You have been signed out or your account no longer exists. Please try signing back in."
          )

          // signout the user
          this.$store.dispatch("unauthenticateUser");
          this.$router.push({name: "Login"});
        }

        return Promise.reject(err);
      }
    )
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

html {
  --theme-color: #24bdd1;
  --theme-lighter:#f0f0f0;
  --button-color-hover: #0199ad;
  --button-color-disabled: #a3b8bb;
  --background-color-selected: #dfecee;
  --max-page-width: 900px;
  --nav-bar-height: 70px;
  --page-padding: 2rem;
  --input-color-hover: var(--background-color-selected);
  font: 16px sans-serif;
  background: var(--theme-lighter);
}

body {
  height: 100vh;
  flex-direction: column;
  display: flex;
  margin: 0;
}

.card {
  width: 100%;
  background-color: white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
  border: 1px solid lightgray;
  border-radius: 4px;
}

button {
  padding: 10px;
  border-radius: 4px;
  border: none;
  background-color: var(--theme-color);
  color: white;
  font-weight: bold;
  transition: all 0.3s;
  text-transform: none;
}

button:hover {
  cursor: pointer;
  background: var(--button-color-hover);
}

button:last-of-type {
  margin-left: 1rem;
}

button:disabled {
  cursor: not-allowed;
  background-color: var(--button-color-disabled);
  color: var(--theme-lighter);
}

button.cancel {
  background-color: transparent;
  border: 1px solid gray;
  color: gray;
}

button.cancel:hover {
  background-color: lightgray;
  color: black;
}

span, p {
  word-break: break-all;
}

.input-error {
  color: red;
  width: 100%;
  margin-bottom: 8px;
  margin-top: 4px;
  font-size: 0.9rem;
}

input, textarea {
  transition: all 0.3s;
}

input:hover:not(:focus),
textarea:hover:not(:focus) {
  background-color: var(--input-color-hover);
}

.overflow-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.icon {
  color: gray
}
</style>