<template>
  <form @submit.prevent="sendMessage">
    <input v-model="messageContent" placeholder="Enter your message" required />
    <button type="submit">Send</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import WebSocketService from '@/services/websocket.service';

export default defineComponent({
  name: 'MessageForm',
  setup() {
    const messageContent = ref('');

    const sendMessage = () => {
      const message = {
        content: messageContent.value,
        receiverId: 'cm2dcwo180001kv4ocppo62ws', // Replace with actual receiver ID
        senderName: "titis",
        conversationId: "cm2eic9ot0000vl8hvcu2t76a"
      };
      WebSocketService.emit('message', message);
      messageContent.value = '';
    };

    return { messageContent, sendMessage };
  }
});
</script>