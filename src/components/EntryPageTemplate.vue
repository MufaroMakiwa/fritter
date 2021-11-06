<template>
  <div class="entry-page-container">
    <header>
      <h1>Welcome to Fritter</h1>
    </header>

    <main>
      <slot></slot>
    </main>
  </div>
</template>

<script>
export default {
  name: "EntryPageTemplate"
}
</script>

<style scoped>
.entry-page-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 1.5rem;
  overflow: scroll;
}

.entry-page-container main {
  display: flex;
  flex-grow: 1;
  width: 100%;
  max-width: 500px;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 8rem;
  padding-bottom: 3em;
}

.entry-page-container header {
  width: 100%;
  text-align: left;
}

.entry-page-container h1 {
  color: var(--theme-color);
}

.auth-page-link {
  color: var(--theme-color);
}

.auth-page-link:active,
.auth-page-link:hover {
  color: var(--button-color-hover);
}
</style>