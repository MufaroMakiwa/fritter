<template>
  <section class="card" v-if="hasUsers">
    <UserCard 
      v-for="(user, index) in users"
      :key="index"
      :user="user"
      :displayRemoveButton="displayRemoveButton"/>
  </section>
  <span v-else>{{ emptyMessage }}</span>
</template>

<script>
import UserCard from './UserCard';

export default {
  name: "UsersList",

  components: {
    UserCard
  },

  props: {
    users: {
      default: () => [],
      type: Array
    },

    emptyMessage: String,

    displayRemoveButton: {
      default: false,
      type: Boolean,
    }
  },

  computed: {
    hasUsers() {
      return this.users.length > 0;
    }
  }
}
</script>

<style scoped>

</style>