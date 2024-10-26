<template>
  <div>
    <ul>
      <li v-for="conversation in conversations" :key="conversation.id" @click="selectConversation(conversation)">
        {{ conversation.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import conversationService from '@/services/conversation.service';

export default {
  name: 'ConversationList',
  data() {
    return {
      conversations: [],
    };
  },
  methods: {
    /**
     * Fetch conversations from the server.
     */
    async fetchConversations() {
      const response = await conversationService.fetchConversations();
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
    this.fetchConversations();
  },
};
</script>