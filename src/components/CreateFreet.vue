<template>
  <div :class="['create-container', isDialog ? 'padded' : '']">
    <div 
      :class="['freet-icon-container', isDialog ? 'icon-margin' : '']" 
      v-if="!editingFreet">
      <FreetIcon :username="username"/>
    </div>

    <section class="create-section">
      <textarea 
        ref="freetContent"
        placeholder="What's happening..."
        v-model="content.value"/>

      <span v-if="hasError" class="input-error">{{ content.error }}</span>

      <div class="freet-submit-container">
        <span 
          :class="['freet-char-count', isExceedingLimit ? 'freet-char-count-error': '']">
          {{ contentLength }}/140</span>
          
        <button 
          :disabled="!canCreate" 
          @click="handleCreate" 
          v-if="!editingFreet">Create freet</button>

        <button 
          v-else
          :disabled="!canUpdate" 
          @click="handleUpdate">Update freet</button>

        <button 
          v-if="editingFreet" 
          class="cancel"
          @click="stopEditing">Cancel</button>
      </div>
    </section>

    <ConfirmDialog ref="confirm"/>

    <AlertDialog ref="alert" />
  </div>
</template>

<script>
import FreetIcon from './FreetIcon';
import ConfirmDialog from './ConfirmDialog';
import AlertDialog from './AlertDialog';
import { post, patch } from '../utils/crud-helpers';
import { eventBus } from '../main';

 
export default {
  name: "CreateFreet",

  components: {
    FreetIcon, ConfirmDialog, AlertDialog
  },

  data() {
    return {
      content: {
        value: this.value,
        error: ""
      }
    }
  },

  props: {
    freetId: String,

    value: {
      default: "",
      type: String,
    },

    editingFreet: {
      default: false,
      type: Boolean,
    },

    autofocus: {
      default: false,
      type: Boolean,
    },

    isDialog: {
      default: false,
      type: Boolean
    }
  },

  computed: {
    username() {
      const user = this.$store.getters.user;
      return user !== null ? user.username : '';
    },

    canCreate() {
      return !this.editingFreet && this.isValidLength;
    },

    canUpdate() {
      return this.editingFreet && this.content.value.trim() !== this.value && this.isValidLength;
    },

    contentLength() {
      return this.content.value.trim().length; 
    },

    // this will return true if the error text is present which would be an error
    // from the server when something unforseen happens
    hasError() {
      return this.content.error.length !== 0;
    },

    isValidLength() {
      return this.content.value.trim().length > 0 && !this.isExceedingLimit;
    },

    isExceedingLimit() {
      return this.content.value.trim().length > 140
    }
  },

  methods: {
    handleCreate() {
      if (!this.canCreate) {
        return;
      }

      post("/api/freets", { content: this.content.value.trim() })
        .then((response) => {
          if (response.isSuccess) {
            // reset the fields and emit to home page
            this.content = { value: "", error: "" } 
            eventBus.$emit('update-freets');

            // display toast for success
            eventBus.$emit('display-toast', "You posted a freet");

            // if creating a freet from a dialog, update parent to close the dialog
            this.isDialog && this.$emit("dismiss-modal");    
            
          } else {
            this.handleErrors(response);
          }
        });
    },

    async handleUpdate() {
      if (!this.canUpdate) {
        return;
      }
      if (!await this.$refs.confirm.open(
        "Update Freet?",
        "This can’t be undone and will remove all this freet's likes and refreets.",
        "Update"
      )) {
        this.stopEditing();
        return;
      }

      patch(`/api/freets/${this.freetId}`, { content: this.content.value.trim() })
        .then((response) => {
          if (response.isSuccess) {
            // emit to home page and hide edit freet UI
            eventBus.$emit('update-freets');
            eventBus.$emit('display-toast', "You updated a freet");
            this.stopEditing();

          } else {
            this.handleErrors(response);
          }
        });
    },

    async handleErrors(response) {
      // this may happen when a freet in deleted in another session while the
      // user in another current session is trying to modify the same freet
      if (response.data.error.freetNotFound) {
        await this.$refs.alert.open("The freet you are trying to modify no longer exists.");
        this.stopEditing();
        eventBus.$emit("update-freets");
        return;
      }
      // this error is likely due to malformed content which is unlikely
      // to happen because the UI will not allow it
      this.content.error = response.data.error;
    },

    stopEditing() {
      eventBus.$emit('stop-editing-freet');
    }
  },

  mounted() {
    // add focus to textarea if required on start
    if (this.autofocus) this.$refs.freetContent.focus();
  }

}
</script>

<style scoped>
.create-container {
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  width: 100%;
}

.create-container.padded {
  padding: 1.5rem;
}

.create-section {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.freet-icon-container.icon-margin {
  margin-right: 1.5rem;
}

textarea {
  background-color: var(--theme-lighter);
  border-radius: 4px;
  padding: 12px;
  resize: none;
  height: 80px;
  font-family: inherit;
  flex-grow: 1;
  font-size: 0.9rem
}

.freet-submit-container {
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-top: 16px;
}

.freet-char-count {
  color: gray;
}

.freet-char-count-error {
  color: red;
}

.freet-submit-container button {
  margin-left: 16px;
}
</style>