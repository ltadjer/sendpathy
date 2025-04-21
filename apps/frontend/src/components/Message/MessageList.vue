<template>
  <ion-header :translucent="true" class="ion-padding header-page">
    <ion-toolbar>
      <ion-item lines="none" class="ion-no-shadow">
        <ion-back-button :defaultHref="true" :icon="arrowBackOutline" />
        <div class="avatar-container" @click.stop="showUserProfile(receiver)">
          <ion-avatar slot="start">
            <img alt="User Avatar" :src="receiver?.avatar" />
          </ion-avatar>
        </div>
        <ion-title>{{ receiver?.username }}</ion-title>
      </ion-item>
    </ion-toolbar>
  </ion-header>

  <ion-content
    class="message-content"
    forceOverscroll="true"
    scrollEvents="true"
    @ionScroll="onScroll"
  >
    <ion-list class="ion-padding">
      <template v-for="(messageGroup, index) in groupedMessages" :key="index">
        <div class="date-separator">{{ formatDate(messageGroup.date) }}</div>
        <ion-item
          lines="none"
          v-for="message in messageGroup.messages"
          :key="message.id"
          :class="{ 'message-out': message.isSentByCurrentUser, 'ion-no-shadow': !message.isSentByCurrentUser, }"
          class="ion-margin-bottom"
          @click="openPopover($event, message)"
        >
          <div class="avatar-container">
            <ion-avatar slot="start" v-if="!message.isSentByCurrentUser">
              <img :src="message.sender?.avatar || '/default-avatar.png'" alt="User Avatar" />
            </ion-avatar>
          </div>
          <div class="message-container" :class="{ 'message-in': !message.isSentByCurrentUser }">
            <ion-label>
              <p :class="{ 'unread': !message.read }">{{ message.content }}</p>
            </ion-label>
            <ion-note slot="end" class="time">
              <sub>{{ timeSince(message.createdAt) }}</sub>
            </ion-note>
          </div>
        </ion-item>
      </template>
    </ion-list>

    <ion-note v-if="!isFriend" class="ion-shadow-in ion-padding">
      Vous ne pouvez plus envoyer de messages à cette personne.
    </ion-note>

  </ion-content>

  <MessageForm
    v-if="isFriend"
    @newMessage="addMessage"
    @editMessage="editMessage"
    :conversation-id="conversationId"
    :receiver-id="receiver?.id"
    :sender-name="currentUser.username"
    :editingMessage="editingMessage"
  />

  <ion-popover :is-open="popoverOpen" @didDismiss="popoverOpen = false" :event="popoverEvent">
    <ion-list>
      <ion-item lines="none" button v-if="selectedMessage?.isSentByCurrentUser" @click="editSelectedMessage">Modifier</ion-item>
      <ion-item lines="none" button @click="deleteMessageForUser">Supprimer pour moi</ion-item>
      <ion-item lines="none" button v-if="selectedMessage?.isSentByCurrentUser" @click="deleteMessageForAll">Supprimer pour tous</ion-item>
    </ion-list>
  </ion-popover>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue';
import { IonToolbar, IonHeader, IonBackButton, IonTitle, IonContent, IonAvatar, IonItem, IonLabel, IonNote, IonList, IonPopover } from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import WebSocketService from '@/services/websocket.service';
import MessageForm from '@/components/Message/MessageForm.vue';
import { timeSince, formatDate } from '@/utils/date';
import { useConversationStore } from '@/stores/conversation'

export default defineComponent({
  name: 'MessageList',
  components: { IonToolbar, IonHeader, IonBackButton, IonTitle, MessageForm, IonContent, IonAvatar, IonItem, IonLabel, IonNote, IonList, IonPopover },
  props: {
    currentUser: { type: Object, required: true },
    conversationId: { type: String, required: true },
    conversation: { type: Object, required: true },
  },
  data() {
    return {
      messages: [],
      loading: false,
      popoverOpen: false,
      popoverEvent: null,
      selectedMessage: null,
      editingMessage: null,
      page: 1,
      limit: 10,
      allMessagesLoaded: false
    };
  },
  computed: {
    filteredMessages() {
      return this.messages.filter(message => message.deletedBy !== this.currentUser.id);
    },
    receiver() {
      return this.conversation?.user;
    },
    groupedMessages() {
      const groups = [];
      let currentGroup = { date: null, messages: [] };

      this.filteredMessages.forEach(message => {
        const messageDate = new Date(message.createdAt).toDateString();
        if (currentGroup.date !== messageDate) {
          if (currentGroup.messages.length) {
            groups.push(currentGroup);
          }
          currentGroup = { date: messageDate, messages: [] };
        }
        currentGroup.messages.push(message);
      });

      if (currentGroup.messages.length) {
        groups.push(currentGroup);
      }

      return groups;
    },
    isFriend() {
      if (!this.currentUser || !Array.isArray(this.currentUser.friendshipsReceived) || !Array.isArray(this.currentUser.friendshipsSent)) {
        return false;
      }

      const isReceivedFriend = this.currentUser.friendshipsReceived.some(friendship =>
        friendship.requesterId === this.receiver?.id && friendship.status === 'ACCEPTED'
      );

      const isSentFriend = this.currentUser.friendshipsSent.some(friendship =>
        friendship.receiverId === this.receiver?.id && friendship.status === 'ACCEPTED'
      );

      return isReceivedFriend || isSentFriend;
    }
  },
  setup() {
    return { arrowBackOutline };
  },
  methods: {
    timeSince,
    formatDate,
    async fetchAllMessages() {
      if (this.loading || this.allMessagesLoaded) return;
      this.loading = true;
      const newMessages = await useConversationStore().fetchAllMessages(this.conversationId, this.page, this.limit);
      if (newMessages.length < this.limit) {
        this.allMessagesLoaded = true;
      }
      this.messages = [...newMessages.reverse(), ...this.messages];
      this.page += 1;
      this.loading = false;
    },
    onScroll(event) {
      const scrollTop = event.detail.scrollTop;
      if (scrollTop <= 10) {
        this.fetchAllMessages();
      }
    },
    openPopover(event, message) {
      this.popoverEvent = event;
      this.selectedMessage = message;
      this.popoverOpen = true;
    },
    editSelectedMessage() {
      this.editingMessage = this.selectedMessage;
      this.popoverOpen = false;
    },
    async deleteMessageForAll() {
      WebSocketService.emit('deleteMessage', { id: this.selectedMessage.id });
      this.popoverOpen = false;
    },
    async deleteMessageForUser() {
      WebSocketService.emit('deleteMessageForUser', { id: this.selectedMessage.id });
      this.popoverOpen = false;
    },
    addMessage(message) {
      if (!this.messages.find(m => m.id === message.id)) {
        message.isSentByCurrentUser = message.senderId === this.currentUser.id;
        this.messages.push(message);
      }
    },
    editMessage(updatedMessage) {
      const index = this.messages.findIndex(m => m.id === updatedMessage.id);
      if (index !== -1) {
        this.messages[index].content = updatedMessage.content;
      }
    },
    showUserProfile(user) {
      this.$router.push({ name: 'UserProfile', params: { userId: user.id } });
    },
  },
  async mounted() {
    await this.fetchAllMessages();

    WebSocketService.on('newMessage', this.addMessage);
    WebSocketService.on('messageUpdated', this.editMessage);
    WebSocketService.on('messageDeleted', (messageId) => {
      this.messages = this.messages.filter(m => m.id !== messageId);
    });
    WebSocketService.on('messageDeletedForUser', (messageId) => {
      this.messages = this.messages.filter(m => m.id !== messageId);
    });

    onUnmounted(() => {
      WebSocketService.off('newMessage', this.addMessage);
      WebSocketService.off('messageUpdated', this.editMessage);
      WebSocketService.off('messageDeleted');
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
.message-content {
  display: flex;
  flex-direction: column-reverse;
  overflow-x: hidden;
  text-align: center;
}

ion-note {
  border-radius: 1rem;
}

/* Séparateur de date */
.date-separator {
  text-align: center;
  padding: 0.5rem;
  font-size: 0.8rem;
  color: var(--ion-color-medium);
}
.blurred {
  filter: blur(5px);
  pointer-events: none;
}

.message-out {
  align-self: flex-end;
  border-radius: 1rem;
  margin-left: auto;
  width: fit-content;
}

.message-in {
  align-self: flex-start;
  border-radius: 1rem;
  padding: 0.8rem;
  box-shadow: var(--neumorphism-in-shadow) !important;
}

ion-popover::part(content) {
  --background: transparent !important;
  --border-radius: 1rem;
}

.time {
  font-size: 0.8rem;
}

</style>