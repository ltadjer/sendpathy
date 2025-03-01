<template>
  <ion-header :translucent="true" class="ion-padding header-page">
    <ion-toolbar>
      <ion-item lines="none" class="ion-no-shadow">
        <ion-back-button :defaultHref="true" :icon="arrowBackOutline" />
        <div class="avatar-container">
          <ion-avatar>
            <img :src="receiver?.avatar" alt="User Avatar" />
          </ion-avatar>
        </div>
        <ion-title>{{receiver?.username}}</ion-title>
      </ion-item>

    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-list class="ion-padding">
      <ion-item
        lines="none"
        v-for="message in messages"
        :key="message.id"
        :class="{
          'message-out': message.isSentByCurrentUser,
          'ion-no-shadow ion-no-padding': !message.isSentByCurrentUser
        }"
        class="ion-margin-bottom"
      >
        <div class="avatar-container">
          <ion-avatar slot="start" v-if="!message.isSentByCurrentUser">
            <img :src="message.sender.avatar || '/default-avatar.png'" alt="User Avatar" />
          </ion-avatar>
        </div>
        <div :class="{
          'message-in': !message.isSentByCurrentUser
        }"
        class="message-container">
          <ion-label>
            <p :class="{ 'unread': !message.read }">{{ message.content }}</p>
          </ion-label>
          <ion-note slot="end" class="time">
            <sub>{{ timeSince(message.createdAt) }}</sub>
          </ion-note>
        </div>

      </ion-item>
    </ion-list>
    <MessageForm @newMessage="addMessage" :conversation-id="conversationId" :receiver-id="receiver?.id" :sender-name="currentUser.username"/>
  </ion-content>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { IonToolbar, IonHeader, IonBackButton, IonTitle, IonButtons, IonContent, IonAvatar, IonItem, IonLabel, IonNote, IonList } from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import WebSocketService from '@/services/websocket.service';
import MessageForm from '@/components/MessageForm.vue';
import conversationService from '@/services/conversation.service';
import { timeSince } from '@/utils/date';

export default defineComponent({
  name: 'MessageList',
  components: { IonToolbar, IonHeader, IonBackButton, IonTitle, IonButtons, MessageForm, IonContent, IonAvatar, IonItem, IonLabel, IonNote, IonList },
  props: {
    currentUser: {
      type: Object,
      required: true
    },
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
  computed: {
    receiver() {
      return this.messages[0]?.conversation.users.find(user => user.id !== this.currentUser.id);
    }
  },
  setup() {
    return { arrowBackOutline };
  },
  methods: {
    timeSince,
    async fetchAllMessages() {
      this.messages = await conversationService.fetchAllMessages(this.conversationId);
    },
    addMessage(message) {
      this.messages.push(message);
    },
  },
  async mounted() {
    await this.fetchAllMessages();

    const handleNewMessage = (message) => {
      this.addMessage(message);
    };

    WebSocketService.off('newMessage', handleNewMessage);
    WebSocketService.on('newMessage', handleNewMessage);

    onUnmounted(() => {
      WebSocketService.off('newMessage', handleNewMessage);
    });

    WebSocketService.socket.on('disconnect', () => {
      console.warn('WebSocket disconnected');
    });

    WebSocketService.socket.on('connect', () => {
      console.log('WebSocket connected');
    });
  },
});
</script>

<style scoped>
.message-out {
  align-self: flex-end;
  border-radius: 1rem;
  margin-left: auto;
  --padding-start: 0;
  width: fit-content;
}
.message-in {
  align-self: flex-start;
  border-radius: 1rem;
  padding: .8rem;
  box-shadow: var(--neumorphism-in-shadow) !important;
}

.message-container {
  justify-content: space-between;
  display: flex;
  align-items: center;
}

.message-out .message-container {
  width: fit-content;
}

.time {
  margin-left: 1rem;
  font-size: 0.8rem;
  font-weight: bold;
}

</style>