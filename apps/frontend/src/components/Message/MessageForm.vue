<template>
  <ion-footer class="ion-padding footer-page">
    <ion-toolbar>
      <form @submit.prevent="sendMessage" class="message-form">
        <ion-item lines="none" class="ion-no-shadow">
          <ion-input v-model="messageContent" placeholder="Votre message" required></ion-input>
          <custom-button
            :icon="sendOutline"
            slot="end"
            @click.stop="sendMessage()"
          />
        </ion-item>
      </form>
    </ion-toolbar>
  </ion-footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import WebSocketService from '@/services/websocket.service';
import CustomButton from '@/components/Commun/CustomButton.vue';
import { sendOutline } from 'ionicons/icons';
import { IonFooter, IonToolbar, IonItem, IonInput } from '@ionic/vue';

export default defineComponent({
  name: 'MessageForm',
  components: { CustomButton, IonFooter, IonToolbar, IonItem, IonInput },
  data() {
    return {
      messageContent: '',
      isEditing: false,
      editingMessageId: null as string | null,
    };
  },
  props: {
    conversationId: { type: String, required: true },
    senderName: { type: String, required: true },
    receiverId: { type: String, required: true },
    editingMessage: { type: Object, default: null },
  },
  watch: {
    editingMessage(newMessage) {
      if (newMessage) {
        this.messageContent = newMessage.content;
        this.isEditing = true;
        this.editingMessageId = newMessage.id;
      } else {
        this.resetForm();
      }
    },
  },
  setup() {
    return { sendOutline };
  },
  methods: {
    sendMessage() {
      if (!this.messageContent.trim()) return;

      if (this.isEditing && this.editingMessageId) {
        // 🔹 Mise à jour via WebSocket
        WebSocketService.emit('updateMessage', {
          id: this.editingMessageId,
          content: this.messageContent,
        });
      } else {
        // 🔹 Envoi d’un nouveau message via WebSocket
        WebSocketService.emit('message', {
          content: this.messageContent,
          receiverId: this.receiverId,
          senderName: this.senderName,
          conversationId: this.conversationId,
        });
      }

      this.resetForm();
    },
    resetForm() {
      this.messageContent = '';
      this.isEditing = false;
      this.editingMessageId = null;
    },
  },
});
</script>

<style scoped>
ion-button {
  --padding-start: 1rem;
  --padding-end: 1rem;
}

ion-input {
  margin-top: 0.6rem !important;
  margin-bottom: 0.6rem !important;
}
</style>