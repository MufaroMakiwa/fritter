<template>
  <div class="image" :style="imageStyle">{{ imageText }}</div> 
</template>

<script>
export default {
  name: "FreetIcon",

  props: {
    username: String,
    size: {
      default: 50,
      type: Number
    },
    backgroundColor: {
      default: "whitesmoke",
      type: String
    }
  },

  computed: {
    imageText() {
      return this.username.charAt(0).toUpperCase();
    },

    imageStyle() {
      return {
        height: `${this.size}px`,
        width: `${this.size}px`,
        fontSize: `${this.getFontSize()}px`,
        backgroundColor: this.backgroundColor,
      }
    }
  },

  methods: {
    getFontSize() {
      return Math.round(0.5 * this.size);
    }
  }
}
</script>

<style scoped>
.image {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: gray;
  font-weight: bold;
}
</style>