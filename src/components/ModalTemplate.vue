<template>
  <transition name="fade">
    <div 
      class="modal"
      v-if="display"
      @wheel.prevent 
      @scroll.prevent 
      @touchmove.prevent
      @click.stop="modalClick">

      <!-- @click.stop is to avoid calling the click function on parent div-->
      <div
        :class="['dialog-container', 'card', animateModalClick ? 'scale' : '']"
        :style="containerStyle"
        @click.stop> 

        <slot></slot>

      </div>
    </div>
  </transition>
  
</template>

<script>

export default {
  name: "ModalTemplate",

  props: {
    clickToDismiss: {
      default: false,
      type: Boolean,
    },
    
    maxWidth: {
      default: 500,
      type: Number,
    },

    display: {
      default: false,
      type: Boolean
    }
  },

  data() {
    return {
      animateModalClick: false,

      containerStyle: {
        "max-width": `${this.maxWidth}px`
      }
    }
  },

  methods: {
    animateClick() {
      this.animateModalClick = true;
      setTimeout(() => {
        this.animateModalClick = false;
      }, 100);
    },

    closeModal() {
      this.$emit('dismiss-modal')
    },

    modalClick() {
      return this.clickToDismiss ? this.closeModal() : this.animateClick();
    }
  }
}
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
}

.dialog-container.scale {
  transform: scale(1.025);
}

</style>