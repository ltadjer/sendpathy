<template>
  <ion-popover :is-open="isOpen" @didDismiss="closePopover" :event="popoverEvent">
    <ion-content>
      <ion-list>
        <ion-item lines="none" button v-if="selectedMessage?.isSentByCurrentUser" @click="editSelectedMessage">Modifier</ion-item>
        <ion-item lines="none" button @click="deleteMessageForUser">Supprimer pour moi</ion-item>
        <ion-item lines="none" button v-if="selectedMessage?.isSentByCurrentUser" @click="deleteMessageForAll">Supprimer pour tous</ion-item>
      </ion-list>
    </ion-content>
  </ion-popover>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPopover, IonContent, IonList, IonItem } from '@ionic/vue';
import WebSocketService from '@/services/websocket.service';

export default defineComponent({
  name: 'MessagePopover',
  components: { IonPopover, IonContent, IonList, IonItem },
  props: {
    isOpen: { type: Boolean, required: true },
    popoverEvent: { type: Object, required: true },
    selectedMessage: { type: Object, required: true },
    currentUser: { type: Object, required: true }
  },
  emits: ['close', 'messageDeleted', 'messageDeletedForUser', 'editMessage'],
  methods: {
    closePopover() {
      this.$emit('close');
    },
    editSelectedMessage() {
      this.$emit('editMessage', this.selectedMessage);
      this.closePopover();
    },
    deleteMessageForAll() {
      WebSocketService.emit('deleteMessage', { id: this.selectedMessage.id });
      this.$emit('messageDeleted', this.selectedMessage.id);
      this.closePopover();
    },
    deleteMessageForUser() {
      WebSocketService.emit('deleteMessageForUser', { id: this.selectedMessage.id });
      this.$emit('messageDeletedForUser', this.selectedMessage.id);
      this.closePopover();
    }
  }
});
</script>