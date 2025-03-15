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
    async fetchOneConversation(id: string) {
      try {
        return await conversationService.fetchOneConversation(id);
      } catch (error) {
        console.error('Failed to fetch conversation:', error);
      }
    },
    async createOneConversation(conversation: any) {
      try {
        const newConversation = await conversationService.createOneConversation(conversation);
        this.conversations.push(newConversation);
        return newConversation;
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

    async markMessagesAsRead(conversationId: string) {
      try {
        await conversationService.markMessagesAsRead(conversationId);
      } catch (error) {
        console.error('Failed to mark messages as read:', error);
      }
    },

    async fetchAllMessages(conversationId: string, page: number, limit: number) {
      try {
        return await conversationService.fetchAllMessages(conversationId, page, limit);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    },
  },
});