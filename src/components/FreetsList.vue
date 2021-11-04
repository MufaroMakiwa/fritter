<template>
  <section class="freets-list card" v-if="hasFreets">
    <FreetCard 
      v-for="(freet, index) in freets" 
      :key="index"
      :freet="freet"/>
  </section>

  <span v-else>There are no freets to display!</span>
</template>

<script>
import FreetCard from './FreetCard';

export default {
  name: "FreetsList",

  props: {
    freets: {
      default: () => [],
      type: Array,
    },
  },

  computed: {
    hasFreets() {
      return this.freets.length > 0;
    },
  },

  components: {
    FreetCard
  }
}
</script>

<style scoped>
.freets-list {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}
</style>