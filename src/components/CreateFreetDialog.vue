<template>
  <div 
    class="modal" 
    @wheel.prevent 
    @scroll.prevent 
    @touchmove.prevent
    @click="animateClick">
    <div 
      :class="['dialog-container', animateModalClick ? 'scale' : '', 'card' ]"
      @click.stop.prevent>
      <div class="header-container">
        <span class="dialog-title">Compose</span>

        <div class="close-button" @click="closeDialog">
          <font-awesome-icon icon="times" class="icon close"/>
        </div>
      </div>

      <CreateFreet :isDialog="true"/>
    </div>
  </div> 
</template>

<script>
import { eventBus } from '../main';
import CreateFreet from './CreateFreet.vue';

export default {
  name: "CreateFreetDialog",

  components: {
    CreateFreet
  },

  data() {
    return {
      animateModalClick: false
    }
  },

  methods: {
    closeDialog() {
      eventBus.$emit('close-freet-dialog');
    },

    animateClick() {
      this.animateModalClick = true;
      setTimeout(() => {
        this.animateModalClick = false;
      }, 100);
    }
  }
}
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.dialog-container {
  max-width: 550px;
  width: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  z-index: 10;
}

.dialog-container.scale {
  transform: scale(1.025);
}

.header-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1.5rem;
  border-bottom: 1px solid lightgray;
  transition: all 0.3s;
}

.dialog-title {
  flex-grow: 1;
  font-weight: bold;
  color: gray;
}

.close-button {
  color: gray;
  cursor: pointer;
  padding: 8px;
}

.close-button .close {
  font-size: 1.25rem;
  transition: all 0.3s
}

.close-button:hover .close{
  transform: scale(1.2);
}
</style>