<template>
  <ion-content>
    <ion-list class="ion-padding">
      <ion-item-sliding
        v-for="conversation in filteredConversations"
        :key="conversation.id"
        class="conversation-item"
      >
        <ion-item @click="selectConversation(conversation)" lines="none">
          <div class="avatar-container">
            <ion-avatar slot="start">
              <img :src="conversation.user?.avatar || '/default-avatar.png'" alt="User Avatar" />
            </ion-avatar>
          </div>
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
        <ion-item-options side="end">
          <ion-item-option @click="deleteConversation(conversation.id)">
            Supprimer
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-list>
  </ion-content>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonButtons, IonButton, IonLabel, IonNote, IonBadge, IonSearchbar, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/vue';
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
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonSearchbar,
    IonItemSliding, IonItemOptions, IonItemOption
  },
  data() {
    return {
      searchTerm: '',
    };
  },
  computed: {
    filteredConversations() {
      return this.conversations.filter(conversation =>
        conversation.user?.username.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
  },
  methods: {
    selectConversation(conversation) {
      this.$router.push(`/conversations/${conversation.id}`);
    },
    deleteConversation(conversationId) {
      // Logic to delete the conversation
      console.log('Delete conversation:', conversationId);
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

ion-item-sliding {
  box-shadow: var(--neumorphism-out-shadow);
  border-radius: 1rem;
}

.avatar-container {
  margin-bottom: 0;
  margin: 0.6rem;
}

ion-item-option:hover {
  box-shadow: var(--neumorphism-in-shadow);
}

</style>