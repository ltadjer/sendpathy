import api from './api.service';
export default {
    /**
     * Fetch all conversations for the logged-in user.
     */
    async fetchAllConversations() {
        const response = await api.get('/conversations');
        console.log(response.data);
        return response.data;
    },

    /**
     * Fetch messages for a specific conversation.
     * @param conversationId - The ID of the conversation.
     */
    async fetchAllMessages(conversationId: string) {
        const response = await api.get(`/conversations/${conversationId}/messages`);
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
     * Update a message in a specific conversation.
     * @param conversationId - The ID of the conversation.
     * @param messageId - The ID of the message.
     * @param messageContent - The new content of the message.
     */
    async updateMessage(conversationId: string, messageId: string, messageContent: string) {
        const response = await api.put(`/conversations/${conversationId}/messages/${messageId}`, { content: messageContent });
        return response.data;
    },

    /**
     * Delete a message in a specific conversation.
     * @param conversationId - The ID of the conversation.
     * @param messageId - The ID of the message.
     */
    async deleteMessage(conversationId: string, messageId: string) {
        const response = await api.delete(`/conversations/${conversationId}/messages/${messageId}`);
        return response.data;
    },
};