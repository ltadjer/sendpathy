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
          <div v-else-if="notification.type === 'FRIEND_REQUEST' && isFriendshipAccepted(notification.sender.id) && !isFriend(notification.sender.id) && !isFriendshipPending(notification.sender.id) && isSent" class="notification-actions">
            <ion-button @click="inviteBack(notification.sender.id)">Inviter en retour</ion-button>
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
import { useAccountStore } from '@/stores/account'

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
  data() {
    return {
      isSent: false,
    };
  },
  computed: {
    notifications() {
      return useNotificationStore().notifications;
    },
    friendships() {
      return useFriendshipStore().friendships;
    },
    currentUser() {
      return useAccountStore().user;
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
      const isReceiver = this.friendships.find(f => f.requesterId === senderId && f.receiverId === this.currentUser.id);
      return isReceiver && isReceiver.status === 'ACCEPTED';
    },
    isFriend(userId: string) {
      return this.friendships.some(f => (f.requesterId === userId && f.receiverId === userId) && f.status === 'ACCEPTED');
    },
    isFriendshipPending(userId: string) {
      return this.friendships.some(f => f.requesterId === this.currentUser.id && f.receiverId === userId);
    },
    async acceptFriendRequest(notification) {
      const friendship = this.friendships.find(f => f.requesterId === notification.sender.id && f.receiverId === this.currentUser.id);
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
    async inviteBack(userId: string) {
      await useFriendshipStore().createOneFriendship({ requesterId: this.currentUser.id, receiverId: userId, status: 'PENDING' });
      this.isSent = true;
      await useNotificationStore().fetchAllNotifications();
    },
    formatDate(dateString: string) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    },
  },
});
</script>

<style scoped>
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

ion-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>