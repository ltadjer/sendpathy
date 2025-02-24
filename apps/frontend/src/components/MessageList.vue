<template>

  <ion-content>
    <ion-list class="ion-padding">
      <ion-item
        lines="none"
        v-for="message in messages"
        :key="message.id"
        :class="{
          'message-out': message.senderId === currentUser.id,
          'message-in': message.senderId !== currentUser.id
        }"
        class="ion-margin-bottom"
      >
        <ion-avatar slot="start">
          <img :src="message.senderAvatar || '/default-avatar.png'" alt="User Avatar" />
        </ion-avatar>
        <ion-label>
          <h2>{{ message.senderName }}</h2>
          <p :class="{ 'unread': message.read === false }">{{ message.content }}</p>
        </ion-label>
        <ion-note slot="end" class="time">
          {{ timeSince(message.createdAt) }}
        </ion-note>
      </ion-item>
    </ion-list>
    <MessageForm @newMessage="addMessage"  :conversation-id="conversationId" :receiver-id="receiverId"  :sender-name="currentUser.username"/>
  </ion-content>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { IonContent, IonList, IonItem, IonAvatar, IonLabel, IonNote } from '@ionic/vue';
import WebSocketService from '@/services/websocket.service';
import MessageForm from '@/components/MessageForm.vue';
import conversationService from '@/services/conversation.service';
import { timeSince} from '@/utils/date'

export default defineComponent({
  name: 'MessageList',
  components: { MessageForm },
  props: {
    currentUser: {
      type: String,
      required: true
    },
    conversationId: {
      type: String,
      required: true
    }
  },
  components: {
    MessageForm,
    IonContent,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonNote,

  },
  data() {
    return {
      messages: [],
    };
  },
  computed: {
    receiverId() {
      if (this.conversation) {
        return this.conversation.user.id !== this.currentUser.id ? this.conversation.user.id : this.conversation.otherUserId;
      }
      return null;
    }
  },
  methods: {
    timeSince,
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
});
</script>

