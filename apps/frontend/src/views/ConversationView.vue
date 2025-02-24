<template>
  <ion-page>
    <ConversationList :conversations="conversations" :current-user="currentUser" />
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ConversationList from '@/components/ConversationList.vue';
import { IonPage } from '@ionic/vue';
import { useAccountStore } from '@/stores/account'
import conversationService from '@/services/conversation.service'

export default defineComponent({
  name: 'ConversationView',
  components: {
    ConversationList,
    IonPage
  },
  data() {
    return {
      conversations: [],
    };
  },
  computed: {
    conversations() {
      return [];
    },
    currentUser() {
      return useAccountStore().user;
    },
  },
  methods: {
    /**
     * Fetch conversations from the server.
     */
    async fetchAllConversations() {
      const response = await conversationService.fetchAllConversations();
      this.conversations = response;
    },
  },
  async created() {
    await this.fetchAllConversations();
  },
});
</script>