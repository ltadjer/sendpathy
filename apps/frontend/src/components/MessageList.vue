<template>
  <div>
    <ul>
      <li v-for="message in messages" :key="message.id">{{ message.content }}</li>
    </ul>
    <MessageForm @newMessage="addMessage" />
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import conversationService from '@/services/conversation.service';
import WebSocketService from '@/services/websocket.service';
import MessageForm from '@/components/MessageForm.vue';

export default {
  name: 'MessageList',
  components: { MessageForm },
  props: {
    conversationId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      messages: [],
    };
  },
  methods: {
    /**
     * Fetch messages for the selected conversation.
     */
    async fetchAllMessages() {
      const response = await conversationService.fetchAllMessages(this.conversationId);
      this.messages = response;
    },
    /**
     * Add a new message to the list.
     * @param message - The new message to add.
     */
    addMessage(message) {
      console.log(message);
      this.messages.push(message);
    },
  },
  mounted() {
    // Fetch existing messages when the component is mounted
    this.fetchAllMessages();

    // Listen for new messages via WebSocket
    const handleNewMessage = (message) => {
      this.addMessage(message);
    };

    // Ensure the listener is only attached once
    WebSocketService.off('newMessage', handleNewMessage);
    WebSocketService.on('newMessage', handleNewMessage);

    // Clean up WebSocket listeners when the component is unmounted
    onUnmounted(() => {
      WebSocketService.off('newMessage', handleNewMessage);
    });

    // Handle WebSocket disconnection
    WebSocketService.socket.on('disconnect', () => {
      console.warn('WebSocket disconnected');
    });

    // Handle WebSocket connection
    WebSocketService.socket.on('connect', () => {
      console.log('WebSocket connected');
    });
  },
};
</script>