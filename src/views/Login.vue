<template>
  <EntryPageTemplate>
    <EntryForm
      title="Sign In"
      endpoint="/api/user/session" />

    <span>New to Fritter? 
      <router-link :to="{ name: 'Register' }" class="auth-page-link">Create account</router-link>
    </span>
  </EntryPageTemplate>
</template>

<script>
import EntryForm from '../components/EntryForm';
import EntryPageTemplate from '../components/EntryPageTemplate';


export default {
  name: "Login",

  components: {
    EntryPageTemplate, EntryForm,
  },

  computed: {
    isSignedIn() {
      return this.$store.getters.isSignedIn;
    }
  },
}
</script>
