<template>
  <transition name="slide-fade">
    <span class="toast-container">
      {{ message }}
    </span>
  </transition>
</template>


<script>
export default {
  name: "Toast",

  props: {
    message: String
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  display: inline-block;
  padding: 16px;
  width: fit-content;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--theme-color);
  color: white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  z-index: 10;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 1s ease;
}

.slide-fade-enter, 
.slide-fade-leave-to {
  transform: translate(-50%, 100%);
  opacity: 0;
}
</style>