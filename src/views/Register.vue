<template>
  <EntryPageTemplate>
    <EntryForm
      title="Create Account"
      endpoint="/api/user" />

    <span>Already have an account?
      <router-link :to="{ name: 'Login'}" class="auth-page-link">Sign In</router-link> 
    </span>
  </EntryPageTemplate>
</template>

<script>
import EntryPageTemplate from '../components/EntryPageTemplate';
import EntryForm from '../components/EntryForm'


export default {
  name: "Register",

  components: {
    EntryPageTemplate, EntryForm
  },

  computed: {
    isSignedIn() {
      return this.$store.getters.isSignedIn;
    }
  },
}
</script>
