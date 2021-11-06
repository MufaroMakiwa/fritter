<template>
  <ModalTemplate
    :clickToDismiss="options.clickToDismiss"
    :maxWidth="400"
    :display="dialog"
    @dismiss-modal="cancel">
    <div class="confirm-container">
      <h3>{{ title }}</h3>

      <span>{{ summary }}</span>

      <div class="buttons-container">
        <button 
          :class="[options.isWarning ? 'action' : '']" 
          @click="agree">{{ actionButtonLabel }}</button>
        <button class="cancel" @click="cancel">Cancel</button>
      </div>
    </div>
  </ModalTemplate>
</template>

<script>
import ModalTemplate from './ModalTemplate';

// https://techformist.com/reusable-confirmation-dialog-vuetify/
export default {
  name: "ConfirmDialog",

  components: {
    ModalTemplate
  },

  data() {
    return {
      dialog: false,
      resolve: null,
      reject: null,
      title: "",
      summary: "",
      actionButtonLabel: "",
      options: {
        isWarning: true,
        clickToDismiss: false
      }
    }
  },

  methods: {
    cancel() {
      this.dialog = false;
      this.resolve(false);
    },

    agree() {
      this.dialog = false;
      this.resolve(true);
    },

    open(title, summary, actionButtonLabel, options = {}) {
      this.dialog = true;
      this.title = title;
      this.summary = summary;
      this.actionButtonLabel = actionButtonLabel;
      this.options = Object.assign(this.options, options);

      return new Promise((resolve, reject) => {
          this.resolve = resolve;
          this.reject = reject;
        });
    }
  }
}
</script>

<style scoped>
.confirm-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1.5rem;
}

.confirm-container span {
  color: gray;
  width: 100%;
  margin-top: 1.5rem;
  word-break: normal;
}

.buttons-container {
  display: grid;
  margin-top: 1.5rem;
  grid-gap: 1.5rem;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
}

.buttons-container button {
  margin: 0;
  height: 40px;
  border-radius: 20px;
  outline: none;
}

.buttons-container button.action {
  background-color: red;
  color: white;
} 

.buttons-container button.action:hover {
  background-color: firebrick;
}
</style>