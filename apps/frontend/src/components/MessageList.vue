<template>
  <div>
    <ul>
      <li v-for="message in messages" :key="message.id">{{ message.content }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import WebSocketService from '@/services/websocket.service';

export default defineComponent({
  name: 'MessageList',
  setup() {
    const messages = ref<any[]>([]);

    const handleNewMessage = (message: any) => {
      messages.value.push(message);
    };

    onMounted(() => {
      WebSocketService.on('newMessage', handleNewMessage);
    });

    onUnmounted(() => {
      WebSocketService.disconnect();
    });

    return { messages };
  }
});
</script>