<template>
  <ion-page>
    <ion-header>
      <ion-header :translucent="true" class="ion-padding header-page">
        <ion-toolbar>
          <ion-item lines="none" class="ion-no-shadow ion-align-items-center">
            <div class="avatar-container" @click.stop="showUserProfile(currentUser)">
              <ion-avatar slot="start">
                <img alt="User Avatar" :src="currentUser?.avatar" />
              </ion-avatar>
            </div>
            <ion-title>Conversations</ion-title>
          </ion-item>
          <ion-buttons slot="end">
            <ion-button size="small" class="ion-no-shadow">
              <img alt="Logo" src="@/assets/logo.png" width="50px" />
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-searchbar class="ion-margin-top ion-no-padding" v-model="searchTerm" placeholder="Rechercher"></ion-searchbar>
      </ion-header>
    </ion-header>
    <ConversationList :conversations="conversations" :current-user="currentUser" :search-term="searchTerm" />
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ConversationList from '@/components/Message/ConversationList.vue';
import { IonPage, IonButton, IonButtons, IonTitle, IonSearchbar, IonToolbar, IonItem, IonHeader, IonAvatar } from '@ionic/vue';
import { useAccountStore } from '@/stores/account';
import { useConversationStore } from '@/stores/conversation';

export default defineComponent({
  name: 'ConversationView',
  components: {
    IonButton, IonButtons, IonTitle, IonSearchbar, IonToolbar, IonItem, IonHeader, IonAvatar,
    ConversationList,
    IonPage
  },
  data() {
    return {
      searchTerm: '',
    };
  },
  computed: {
    conversations() {
      return useConversationStore().conversations;
    },
    currentUser() {
      return useAccountStore().user;
    },
    filteredConversations() {
      return this.conversations.filter(conversation =>
        conversation.user?.username.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
  },
  methods: {
    showUserProfile(user) {
      this.$router.push({ name: 'UserProfile', params: { userId: user.id } });
    },
  },
  async created() {
    await useConversationStore().fetchAllConversations();
  },
});
</script>
<style scoped>
.avatar-container {
  margin-bottom: 0;
}
</style>