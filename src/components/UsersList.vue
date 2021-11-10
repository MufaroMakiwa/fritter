<template>
  <section class="card" v-if="hasUsers">
    <UserCard 
      v-for="(user, index) in users"
      :key="index"
      :user="user"
      :displayRemoveButton="displayRemoveButton"/>
  </section>

  <NoContent 
    v-else
    :title="emptyTitle"
    :summary="emptySummary">

    <button 
      v-if="displayNoContentDiscover" 
      class="no-content-button"
      @click.stop="goToDiscover">
      Discover people to follow 
    </button>

  </NoContent>
</template>

<script>
import UserCard from './UserCard';
import NoContent from './NoContent';
import { eventBus } from '../main';


export default {
  name: "UsersList",

  components: {
    UserCard, NoContent
  },

  props: {
    users: {
      default: () => [],
      type: Array
    },

    emptyTitle: String,
    emptySummary: String,

    displayRemoveButton: {
      default: false,
      type: Boolean,
    },

    displayNoContentDiscover: {
      default: false,
      type: Boolean,
    }
  },

  computed: {
    hasUsers() {
      return this.users.length > 0;
    }
  },

  methods: {
    goToDiscover() {
      eventBus.$emit("toggle-discover", "discover");
    }
  }
}
</script>

<style scoped>

</style>