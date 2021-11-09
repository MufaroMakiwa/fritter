<template>
  <MainPageTemplate :loading="loading" :displaySidebar="true">
    <h2 class="section-title">Notifications</h2>

    <div class="tab-navigator">
      <div 
        v-for="(tab, index) in notificationTabs"
        :class="[activeTab === tab ? 'active' : '']"
        :key="index"
        @click="setActiveTab(tab)">
        <h4 class="tab">{{ tab }}</h4>
        <h4 class="count" v-if="notificationsCount[tab]">{{ notificationsCount[tab] }}</h4>

      </div>
    </div>
    <section v-if="hasNotifications" class="notifications">
      <NotificationCard 
        v-for="(notification, index) in displayedNotifications"
        :key="index"
        :notification="notification"
        :index="index"/>
    </section>

    <span v-else class="empty-message">{{ noNotificationsMessage }}</span>
  </MainPageTemplate>
</template>

<script>
import MainPageTemplate from '../components/MainPageTemplate';
import NotificationCard from '../components/NotificationCard';
import { patch } from '../utils/crud-helpers';


export default {
  name: "Notifications",

  components: {
    MainPageTemplate, NotificationCard
  },

  data() {
    return {
      loading: true,
      notificationTabs: [ "All", "Freets", "Followers", "Following" ],
      activeTab: "All"
    }
  },

  computed: {
    isSignedIn() {
      return this.$store.getters.isSignedIn;
    },

    displayedNotifications() {
      switch (this.activeTab) {
        case "Freets":
          return this.freetNotifications;

        case "Followers":
          return this.followersNotifications;

        case "Following":
          return this.acceptedRequestNotifications;

        default:
          return this.notifications
      }
    },

    noNotificationsMessage() {
      switch (this.activeTab) {
        case "Freets":
          return "No freet notifications";

        case "Followers":
          return "No follower notifications";

        case "Following":
          return "No following notifications";

        default:
          return "No notifications"
      }
    },

    hasNotifications() {
      return this.displayedNotifications.length > 0;
    },

    notifications() {
      return this.isSignedIn ? this.$store.getters.user.notifications : [];
    },

    freetNotifications() {
      return this.notifications.filter(notification => notification.freetId !== undefined);
    },

    likeNotifications() {
      return this.notifications.filter(notification => notification.likeDetails !== undefined);
    },

    refreetNotifications() {
      return this.notifications.filter(notification => notification.refreetDetails !== undefined);
    },

    acceptedRequestNotifications() {
      return this.notifications.filter(notification => {
        return notification.relationStatus === "ACTIVE" && notification.isAcceptedRequest;
      })
    },

    followersNotifications() {
      return this.notifications.filter(notification => {
        return notification.relationStatus === "PENDING" || 
              (notification.relationStatus === "ACTIVE" && !notification.isAcceptedRequest)
      })
    },

    notificationsCount() {
      const result = { 
        Freets: 0,
        Followers: 0,
        Following: 0
      }

      this.followersNotifications.forEach(notification => {
        notification.notificationStatus === "NEW" && result.Followers++;
      });

      this.acceptedRequestNotifications.forEach(notification => {
        notification.notificationStatus === "NEW" && result.Followers++;
      });

      this.likeNotifications.forEach(notification => {
        notification.likeDetails.notificationStatus === "NEW" && result.Freets++
      });

      this.refreetNotifications.forEach(notification => {
        notification.refreetDetails.notificationStatus === "NEW" && result.Freets++
      });

      return result;
    },
  },

  methods: {
    isActiveTab(tab) {
      return this.$route.path.includes(tab);
    },

    withoutUrlLastPath() {
      const current = window.location.pathname;
      let toRemove;
      if (current.includes("freets")) toRemove = "freets";
      if (current.includes("followers")) toRemove = "followers";
      if (current.includes("following")) toRemove = "following";

      if (toRemove !== undefined) {
        return current.substring(0, current.lastIndexOf(toRemove) - 1);

      } else if (current.charAt(current.length - 1) === "/") {
        return current.substring(0, current.length - 1);

      } else {
        return current;
      }
    },

    setActiveTab(tab) {
      if (this.activeTab === tab) return;
      this.activeTab = tab;

      // update the url
      const noExtension = this.withoutUrlLastPath();
      if (tab === "All") {
        history.replaceState({}, null, noExtension);

      } else {
        history.replaceState({}, null, `${noExtension}/${tab.toLowerCase()}`);
      }
    },
  },

  mounted() {
    if (this.isActiveTab("freets")) {
      this.setActiveTab("Freets");

    } else if (this.isActiveTab("followers")) {
      this.setActiveTab("Followers");

    } else if (this.isActiveTab("following")) {
      this.setActiveTab("Following");
    
    } else {
      this.setActiveTab("All");
    }
  },

  created() {
    // update all like and refreet notifications as seen
    const body = {
      updatedStatus: "SEEN",
      likeIds: this.likeNotifications.map(notification => notification.likeDetails.likeId),
      refreetIds: this.refreetNotifications.map(notification => notification.refreetDetails.refreetId),
      acceptedRequestIds: this.acceptedRequestNotifications.map(notification => notification.relationId),
      newFollowerIds: this.followersNotifications.map(notification => notification.relationId)
    };

    patch('/api/user/notifications', body)
      .then(response => {
        if (response.isSuccess) {
          this.loading = false;
        } else {
          // the only expected error is when the user is not logged in which is
          // handled in App.vue
        }
      });
  },
}
</script>

<style scoped>
.notifications {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
}

.tab-navigator {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  transition: all 0.3s;
  border-bottom: 1px solid lightgray;
}

.tab-navigator div {
  padding: 1rem 0;
  flex-grow: 1;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 3px solid var(--theme-lighter);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.tab-navigator .tab { 
  color: gray;  
  text-align: center;
  transition: all 0.3s;
}

.tab-navigator .count {
  margin-left: 0.5rem;
  color: var(--theme-color);
}

.tab-navigator div:hover {
  background-color: whitesmoke;
  border-bottom: 3px solid var(--button-color-disabled);
}

.tab-navigator div.active {
  background-color: var(--theme-lighter);
  border-bottom: 3px solid var(--theme-color);
}

.tab-navigator div.active .tab {
  color: black;
}

.empty-message {
  margin-top: 1.5rem;
}
</style>
