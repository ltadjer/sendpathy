<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Conversations</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item v-for="conversation in conversations" :key="conversation.id" @click="selectConversation(conversation)">
          {{ conversation.name }}
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem } from '@ionic/vue';

import conversationService from '@/services/conversation.service';

export default defineComponent({
  name: 'ConversationList',
  data() {
    return {
      conversations: [],
    };
  },
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem
  },
  methods: {
    /**
     * Fetch conversations from the server.
     */
    async fetchAllConversations() {
      const response = await conversationService.fetchAllConversations();
      this.conversations = response;
    },
    /**
     * Select a conversation and navigate to the conversation's messages.
     * @param conversation - The selected conversation.
     */
    selectConversation(conversation) {
      this.$router.push(`/conversations/${conversation.id}`);
    },
  },
  mounted() {
    this.fetchAllConversations();
  },
});
</script>