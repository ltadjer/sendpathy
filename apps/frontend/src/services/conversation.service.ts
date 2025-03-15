import api from './api.service';
export default {
    /**
     * Fetch all conversations for the logged-in user.
     */
    async fetchAllConversations() {
        const response = await api.get('/conversations');
        return response.data;
    },
    async fetchOneConversation(conversationId: string) {
        const response = await api.get(`/conversations/${conversationId}`);
        return response.data;
    },
    async createOneConversation(conversation: any) {
        const response = await api.post('/conversations', conversation);
        return response.data;
    },
    async deleteOneConversation(conversationId: string) {
        const response = await api.delete(`/conversations/${conversationId}`);
        return response.data;
    },

    async markMessagesAsRead(conversationId) {
        return await api.patch(`/conversations/${conversationId}/mark-read`);
    },

    /**
     * Fetch messages for a specific conversation.
     * @param conversationId - The ID of the conversation.
     * @param page - The page number.
     * @param limit - The number of messages per page.
     */
    async fetchAllMessages(conversationId, page, limit) {
        const response = await api.get(`/conversations/${conversationId}/messages`, {
            params: { page, limit }
        });
        return response.data;
    },

    /**
     * Send a new message in a specific conversation.
     * @param conversationId - The ID of the conversation.
     * @param messageContent - The content of the message.
     */
    async sendMessage(conversationId: string, messageContent: string) {
        const response = await api.post(`/conversations/${conversationId}/messages`, { content: messageContent });
        return response.data;
    },

    /**
     * Delete a message in a specific conversation.
     * @param conversationId - The ID of the conversation.
     * @param messageId - The ID of the message.
     */
    async deleteOneMessage(conversationId: string, messageId: string) {
        const response = await api.delete(`/conversations/${conversationId}/messages/${messageId}`);
        return response.data;
    },


    async deleteOneMessageForUser(messageId: string, userId: string) {
        const response = await api.delete(`/messages/${messageId}/for-user`, { data: { userId } });
        return response.data;
    },

    async updateOneMessage(conversationId: string, messageId: string, messageContent: string) {
        const response = await api.patch(`/messages/${messageId}`, { content: messageContent });
        return response.data;
    }

};