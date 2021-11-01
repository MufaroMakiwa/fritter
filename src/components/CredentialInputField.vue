<template>
  <div class="input-container">
    <label :for="name" class="input-label" v-if="displayLabel">
      {{ label }}:
    </label>
    
    <input 
      class="input"
      :name="name" 
      :value="value"
      :type="inputType"
      :placeholder="this.placeholder"
      :autocomplete="autocomplete"
      @input="$emit('input', $event.target.value)" />

    <span v-if="hasError" class="input-error">{{ error }}</span>

    <div v-if="isPasswordField" class="password-toggle" @click="togglePassword">
      <input type="checkbox" name="password-toggle" v-model="showPassword"/>
      <label for="password-toggle">Show password</label>
    </div>
  </div>
</template>

<script>
export default {
  name: "CredentialInputField",

  data () {
    return {
      showPassword: false 
    }
  },

  props: {
    name: String,
    label: String,
    value: String,
    error: String,
    isPasswordField: {
      default: false,
      type: Boolean
    },
    autocomplete: {
      default: 'off',
      type: String,
    },
    placeholder: {
      default: '',
      type: String,
    },
    displayLabel: {
      default: true,
      type: Boolean
    }
  },


  computed: {
    hasError() {
      return this.error.length !== 0;
    },

    inputType() {
      return this.isPasswordField && !this.showPassword ? "password" : "text";
    }
  },

  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    }
  }
}
</script>

<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0.3rem 0;
}

.input-label {
  margin-bottom: 8px;
}

.input-container .input {
  border: 1px solid lightgray;
  padding: 10px;
  border-radius: 4px;
  letter-spacing: .075rem;
}

.password-toggle {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: 8px;
  cursor: pointer;
  width: fit-content;
  transition: all 0.3s;
}

.password-toggle > * {
  cursor: pointer;
}

.password-toggle:hover {
  color: gray;
}

.password-toggle input[type="checkbox"] {
  margin: 0;
}

.password-toggle label {
  margin-left: 8px;
}
</style>