import { defineStore } from 'pinia';
import conversationService from '@/services/conversation.service';

export const useConversationStore = defineStore('conversation', {
  state: () => ({
    conversations: [] as Array<any>,
  }),
  actions: {
    async fetchAllConversations() {
      try {
        this.conversations = await conversationService.fetchAllConversations();
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      }
    },
    async createOneConversation(conversation: any) {
      try {
        const newConversation = await conversationService.createOneConversation(conversation);
        this.conversations.push(newConversation);
      } catch (error) {
        console.error('Failed to add conversation:', error);
      }
    },
    async deleteOneConversation(id: string) {
      try {
        await conversationService.deleteOneConversation(id);
        this.conversations = this.conversations.filter((c) => c.id !== id);
      } catch (error) {
        console.error('Failed to delete conversation:', error);
      }
    },
  },
});