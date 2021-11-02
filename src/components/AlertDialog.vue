<template>
  <ModalTemplate
    :clickToDismiss="true"
    :maxWidth="400"
    :display="display"
    @dismiss-modal="closeDialog">

    <div class="alert-container">
      <div class="icon-container">
        <font-awesome-icon icon="exclamation-triangle" class="icon"/>
      </div>

      <span>{{ message }}</span>

      <div class="button-container">
        <button @click="closeDialog">Dismiss</button>
      </div>
    </div>

  </ModalTemplate>
</template>

<script>
import ModalTemplate from './ModalTemplate';

export default {
  name: "AlertDialog",

  components: {
    ModalTemplate
  },

  data() {
    return {
      display: false,
      message: "",
      resolve: null,
      reject: null,
    }
  },

  methods: {
    closeDialog() {
      this.resolve(true);
      this.display = false;
    },

    open(message) {
      this.display = true;
      this.message = message;

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      })
    }
  }
}
</script>

<style scoped>
.alert-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1.5rem;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.alert-container span {
  margin-top: 1.5rem;
  color: gray;
  word-break: normal;
}

.button-container button {
  margin: 0;
  height: 40px;
  padding: 0 1.5rem;
  border-radius: 20px;
  outline: none;
}

.button-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-top: 1.5rem;
  width: 100%;
}
</style>