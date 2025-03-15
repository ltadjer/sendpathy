<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-padding header-page">
      <ion-toolbar class="ion-no-shadow">
        <ion-buttons slot="start">
          <ion-back-button :defaultHref="true" :icon="arrowBackOutline" />
        </ion-buttons>
        <ion-title>Notifications</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list class="ion-padding">
        <ion-item lines="none" v-for="notification in notifications" :key="notification.id" class="notification-item">
          <ion-avatar slot="start">
            <img :src="notification.sender.avatar" alt="Sender Avatar" />
          </ion-avatar>
          <ion-label>
            <h2>{{ notification.message }}</h2>
            <p>{{ formatDate(notification.createdAt) }}</p>
          </ion-label>
          <div v-if="notification.type === 'FRIEND_REQUEST' && !isFriendshipAccepted(notification.sender.id)" class="notification-actions">
            <ion-button @click="acceptFriendRequest(notification)">Accepter</ion-button>
            <ion-button @click="ignoreFriendRequest(notification)">Ignorer</ion-button>
          </div>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useNotificationStore } from '@/stores/notification';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonBackButton,
  IonButtons,
  IonButton,
} from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { useFriendshipStore } from '@/stores/friendship';

export default defineComponent({
  components: {
    IonBackButton,
    IonButtons,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonButton,
  },
  computed: {
    notifications() {
      return useNotificationStore().notifications;
    },
    friendships() {
      return useFriendshipStore().friendships;
    },
  },
  setup() {
    return {
      arrowBackOutline,
    };
  },
  async created() {
    await useFriendshipStore().fetchAllFriendships();
    await useNotificationStore().fetchAllNotifications();
  },
  methods: {
    async markAsRead(notificationId: string) {
      await useNotificationStore().markAsRead(notificationId);
    },
    isFriendshipAccepted(senderId: string) {
      const friendship = this.friendships.find(f => f.requesterId === senderId || f.receiverId === senderId);
      return friendship && friendship.status === 'ACCEPTED';
    },
    async acceptFriendRequest(notification) {
      const friendship = this.friendships.find(f => f.requesterId === notification.sender.id);
      if (friendship) {
        await useFriendshipStore().acceptFriendship(friendship.id);
        notification.message = `${notification.sender.username} a commencé à vous suivre`;
        await useNotificationStore().updateNotificationMessage(notification.id, notification.message);
        await useNotificationStore().fetchAllNotifications();
      }
    },
    async ignoreFriendRequest(notification) {
      const friendship = this.friendships.find(f => f.requesterId === notification.sender.id);
      if (friendship) {
        await useFriendshipStore().deleteOneFriendship(friendship.id);
      }
    },
    formatDate(dateString: string) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    },
  },
});
</script>

<style scoped>
.header-page {
  background: var(--ion-color-primary);
}

.notification-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.notification-item ion-avatar {
  margin-right: 10px;
}

.notification-item h2 {
  font-size: 1rem;
  margin: 0;
  font-weight: bold;
}

.notification-item p {
  font-size: 0.8rem;
  color: gray;
  margin: 0;
}

.notification-actions {
  display: flex;
  gap: 10px;
}
</style>