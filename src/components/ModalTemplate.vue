<template>
  <div 
    class="modal"
    @wheel.prevent 
    @scroll.prevent 
    @touchmove.prevent
    @click="clickToDismiss ? closeModal : animateClick">

    <!-- @click.prevent is to avoid calling the click function on parent div-->
    <div
      :class="['dialog-container', containerStyle, 'card', animateModalClick ? 'scale' : '']"
      @click.prevent> 
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalTemplate",

  props: {
    clickToDismiss: {
      default: false,
    },
    
    maxWidth: {
      default: 550,
      type: Number,
    },

    value: Boolean,
  },

  data() {
    return {
      animateModalClick: false
    }
  },

  computed: {
    containerStyle() {
      return {
        maxWidth: `${this.maxWidth}px`
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
      this.$emit('input', false)
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
  width: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
}

.dialog-container.scale {
  transform: scale(1.025);
}

</style>