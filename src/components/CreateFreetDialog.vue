<template>
  <ModalTemplate
    :clickToDismiss="false"
    :maxWidth="550"
    :display="value"
    @dismiss-modal="closeDialog">
    
    <div class="header-container">
      <span class="dialog-title">Create Freet</span>
      <div class="close-button" @click="closeDialog">
        <font-awesome-icon icon="times" class="icon close"/>
      </div>
    </div>

    <CreateFreet :isDialog="true" @dismiss-modal="closeDialog"/>
  </ModalTemplate>
</template>

<script>
import CreateFreet from './CreateFreet';
import ModalTemplate from './ModalTemplate';

export default {
  name: "CreateFreetDialog",

  components: {
    CreateFreet, ModalTemplate
  },

  props: {
    value: Boolean
  },

  data() {
    return {
      animateModalClick: false
    }
  },

  methods: {
    closeDialog() {
      this.$emit('input', false);
    },

    animateClick() {
      this.animateModalClick = true;
      setTimeout(() => {
        this.animateModalClick = false;
      }, 100);
    },

    test() {
      console.log("Modal click");
    }
  }
}
</script>

<style scoped>
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