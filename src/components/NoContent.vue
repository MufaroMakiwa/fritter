<template>
  <div class="not-exist">
    <h3 class="section-title large">{{ title }}</h3>
    <span class="not-exist-summary">{{ summary }}</span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "NoContent",

  props: {
    title: String,
    summary: String,
  }
}
</script>

<style scoped>
.not-exist {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 350px;
}

.section-title.large {
  font-size: 1.75rem;
  width: 100%;
}

.not-exist span {
  color: gray;
  word-break: normal;
  width: 100%;
}

.no-content-button {
  margin-left: 0;
  margin-top: 1.5rem;
  height: 40px;
  padding: 0 1rem;
  border-radius: 20px;
}
</style>