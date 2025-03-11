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
        <ion-title>{{receiver?.username}}</ion-title>
      </ion-item>
    </ion-toolbar>
  </ion-header>
  <ion-content class="message-content" @scroll="onScroll">
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
            <img :src="message.sender?.avatar || '/default-avatar.png'" alt="User Avatar" />
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
        <ion-button fill="clear" @click="openPopover(message.id)">
          <ion-icon name="ellipsis-vertical"></ion-icon>
        </ion-button>
      </ion-item>
    </ion-list>
  </ion-content>
  <MessageForm @newMessage="addMessage" :conversation-id="conversationId" :receiver-id="receiver?.id" :sender-name="currentUser.username"/>
  <MessageActionsPopover
    :is-open="isPopoverOpen"
    :message-id="selectedMessageId"
    :conversation-id="conversationId"
    :current-user-id="currentUser.id"
    @close="closePopover"
    @messageDeleted="removeMessage"
    @messageDeletedForUser="removeMessageForUser"
    @editMessage="editMessage"
  />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { IonToolbar, IonHeader, IonBackButton, IonTitle, IonButtons, IonContent, IonAvatar, IonItem, IonLabel, IonNote, IonList, IonButton, IonIcon } from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import WebSocketService from '@/services/websocket.service';
import MessageForm from '@/components/Message/MessageForm.vue';
import MessageActionsPopover from '@/components/Message/MessageActionsPopover.vue';
import conversationService from '@/services/conversation.service';
import { timeSince } from '@/utils/date';

export default defineComponent({
  name: 'MessageList',
  components: { IonToolbar, IonHeader, IonBackButton, IonTitle, IonButtons, MessageForm, IonContent, IonAvatar, IonItem, IonLabel, IonNote, IonList, IonButton, IonIcon, MessageActionsPopover },
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
      page: 1,
      loading: false,
      isPopoverOpen: false,
      selectedMessageId: ''
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
    async fetchMessages(page = 1) {
      this.loading = true;
      const newMessages = await conversationService.fetchAllMessages(this.conversationId, page);
      this.messages = [...newMessages, ...this.messages];
      this.loading = false;
    },
    addMessage(message) {
      if (!this.messages.find(m => m.id === message.id)) {
        message.isSentByCurrentUser = message.senderId === this.currentUser.id;
        this.messages.push(message);
      }
    },
    removeMessage(messageId) {
      this.messages = this.messages.filter(message => message.id !== messageId);
    },
    removeMessageForUser(messageId) {
      const message = this.messages.find(message => message.id === messageId);
      if (message) {
        message.deletedBy = this.currentUser.id;
      }
    },
    editMessage(messageId) {
      const message = this.messages.find(message => message.id === messageId);
      if (message) {
        // Implement the logic to edit the message
      }
    },
    showUserProfile(user) {
      this.$router.push({ name: 'UserProfile', params: { userId: user.id } });
    },
    async onScroll(event) {
      const { scrollTop } = event.target;
      if (scrollTop === 0 && !this.loading) {
        this.page += 1;
        await this.fetchMessages(this.page);
      }
    },
    openPopover(messageId) {
      this.selectedMessageId = messageId;
      this.isPopoverOpen = true;
    },
    closePopover() {
      this.isPopoverOpen = false;
      this.selectedMessageId = '';
    }
  },
  async mounted() {
    await this.fetchMessages();

    const handleNewMessage = (message) => {
      if (message.conversationId === this.conversationId) {
        this.addMessage(message);
      }
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
.message-content {
  overflow-x: hidden;
  display: flex;
  flex-direction: column-reverse;
}

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