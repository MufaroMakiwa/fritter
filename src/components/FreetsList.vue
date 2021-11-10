<template>
  <section class="freets-list" v-if="hasFreets">
    <FreetCard 
      v-for="(freet, index) in freets" 
      :key="index"
      :freet="freet"/>
  </section>

  <NoContent 
    v-else
    :title="emptyTitle"
    :summary="emptySummary">

    <button 
      v-if="addLetsGoButton" 
      class="no-content-button"
      @click.stop="goToDiscover">
      Let's go
    </button>

  </NoContent>

</template>

<script>
import FreetCard from './FreetCard';
import NoContent from './NoContent';
import { eventBus } from '../main';


export default {
  name: "FreetsList",

  props: {
    freets: {
      default: () => [],
      type: Array,
    },

    addLetsGoButton: {
      default: false,
      type: Boolean,
    },

    emptyTitle: String,
    emptySummary: String,
  },

  methods: {
    goToDiscover() {
      eventBus.$emit("toggle-discover", "discover");
    }
  },

  computed: {
    hasFreets() {
      return this.freets.length > 0;
    },
  },

  components: {
    FreetCard, NoContent
  }
}
</script>

<style scoped>
.freets-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}
</style>