<template>
  <ion-header>
    <ion-header :translucent="true" class="ion-padding header-page">
      <ion-toolbar>
        <ion-item lines="none" class="ion-no-shadow ion-align-items-center">
          <div class="avatar-container">
            <ion-avatar slot="start">
              <img alt="User Avatar" :src="currentUser?.avatar" />
            </ion-avatar>
          </div>
          <ion-title>Conversations</ion-title>
        </ion-item>
        <ion-buttons slot="end">
          <ion-button size="small" class="ion-no-shadow">
            <img alt="Logo" src="@/assets/logo.png" width="50px" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
  </ion-header>
  <ion-content>
    <ion-list class="ion-padding">
      <ion-item
        v-for="conversation in conversations"
        :key="conversation.id"
        @click="selectConversation(conversation)"
        lines="none"
        class="conversation-item"
      >
        <ion-avatar slot="start">
          <img :src="conversation.user?.avatar || '/default-avatar.png'" alt="User Avatar" />
        </ion-avatar>
        <ion-label>
          <h2>{{ conversation.user?.username }}</h2>
          <p :class="{ 'last-message': true, 'unread': conversation.lastMessage?.read === false }">
            {{ conversation.lastMessage?.content }}
          </p>
        </ion-label>
        <ion-note slot="end" class="time">
          {{ timeSince(conversation.lastMessage?.createdAt) }}
        </ion-note>
        <ion-badge v-if="conversation.lastMessage?.read === false" color="secondary" slot="end">1</ion-badge>

      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonButtons, IonButton, IonLabel, IonNote, IonBadge } from '@ionic/vue';
import { timeSince } from '@/utils/date';

export default defineComponent({
  name: 'ConversationList',
  props: {
    currentUser: {
      type: Object,
      required: true,
    },
    conversations: {
      type: Array,
      required: true,
    },
  },
  components: {
    IonAvatar, IonButtons, IonButton, IonLabel, IonNote, IonBadge,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem
  },
  methods: {
    selectConversation(conversation) {
      this.$router.push(`/conversations/${conversation.id}`);
    },
    timeSince,
  },
});
</script>

<style scoped>
.conversation-item ion-label {
  width: calc(100% - 60px);
}

.conversation-item .last-message.unread {
  font-weight: bold;
}

</style>