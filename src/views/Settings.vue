<template>
  <MainPageTemplate :loading="loading">
    <div class="settings-container">
      <section class="settings-headings">
        <h3>Settings</h3>
        <span 
          v-for="(section, index) in settingsSections"
          @click="setActiveTab(section)"
          :class="[active === section ? 'active' : '']" 
          :key="index">
          {{ section }}
        </span>
      </section>

      <section class="settings-operations">
        <h3>{{ active }}</h3>
        <GeneralSettings v-if="active === 'General'" :currentUsername="username"/>
        <PrivacySettings v-if="active === 'Privacy'" />
      </section>
    </div>
  </MainPageTemplate>
</template>

<script>
import MainPageTemplate from '../components/MainPageTemplate';
import GeneralSettings from '../components/GeneralSettings';
import PrivacySettings from '../components/PrivacySettings';

export default {
  name: "Settings",

  components: {
    MainPageTemplate, GeneralSettings, PrivacySettings
  },

  data() {
    return {
      loading: true,
      settingsSections: ["General", "Privacy"],
      active: "General"
    }
  },

  computed: {
    username() {
      const user = this.$store.getters.user;
      return user !== null ? user.username : '';
    },
  },

  methods: {
    setActiveTab(tab) {
      if (this.active === tab) return;
      this.active = tab;

      let updatedRoute;
      const currentPath = window.location.pathname;

      // update the url
      if (tab === "Privacy") {
        if (currentPath.includes("privacy")) return;
        updatedRoute = currentPath.substring(0, currentPath.indexOf("general"));

      } else {
        if (currentPath.includes("general")) return;
        updatedRoute = currentPath.substring(0, currentPath.indexOf("privacy"));
      }

      history.replaceState(
        {},
        null,
        `${updatedRoute}${tab.toLowerCase()}`
      )
    }
  },

  mounted() {
    // update the selected tab
    if (this.$route.path.includes("general")) {
      this.setActiveTab("General");
    } else {
      this.setActiveTab("Privacy");
    }

    this.loading = false;
  },
}
</script>

<style scoped>
.settings-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.settings-container section {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
}

.settings-container section h3 {
  width: 100%;
  border-bottom: 1px solid lightgray;
  margin-bottom: 1rem;
}

.settings-headings {
  width: 250px;
  flex-shrink: 0;
  transition: all 0.3s
}

.settings-headings h3 {
  padding: 0 0 1rem 1rem;
}

.settings-headings span {
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s;
  margin: 0.5rem 0;
  cursor: pointer;
  color: gray;
}

.settings-headings span:first-of-type {
  margin-top: 0rem;
}

.settings-headings span:hover {
  background-color: lightgray;
}

.settings-headings span.active {
  background-color: var(--background-color-selected);
}

.settings-operations {
  flex-grow: 1;
  margin-left: 1.5rem;
}

.settings-operations h3 {
  padding-bottom: 1rem;
}

@media screen and (max-width: 900px) {
  .settings-headings {
    width: 200px;
  }
}
</style>
