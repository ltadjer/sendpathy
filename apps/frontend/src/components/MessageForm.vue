<template>
  <form @submit.prevent="sendMessage">
    <input v-model="messageContent" placeholder="Enter your message" required />
    <button type="submit">Send</button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WebSocketService from '@/services/websocket.service';

export default defineComponent({
  name: 'MessageForm',
  data() {
    return {
      messageContent: ''
    };
  },
  props: {
    conversationId: {
      type: String,
      required: true
    },
    senderName: {
      type: String,
      required: true
    },
    receiverId: {
      type: String,
      required: true
    }
  },
  emits: ['newMessage'],
  methods: {
    /**
     * Send a new message via WebSocket.
     */
    sendMessage() {
      const message = {
        content: this.messageContent,

        receiverId: this.receiverId,
        senderName: this.senderName,
        conversationId: this.conversationId
      };
      WebSocketService.emit('message', message);
      this.messageContent = '';
      this.$emit('newMessage', message);
    }
  }
});
</script>