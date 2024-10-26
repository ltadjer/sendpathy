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
  emits: ['newMessage'],
  methods: {
    /**
     * Send a new message via WebSocket.
     */
    sendMessage() {
      const message = {
        content: this.messageContent,
        receiverId: 'cm2dcwo180001kv4ocppo62ws', // Replace with actual receiver ID
        senderName: "titis",
        conversationId: "cm2eic9ot0000vl8hvcu2t76a"
      };
      WebSocketService.emit('message', message);
      this.messageContent = '';
      this.$emit('newMessage', message);
    }
  }
});
</script>