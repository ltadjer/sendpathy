<template>
  <ion-popover :is-open="isOpen" @did-dismiss="closePopover">
    <ion-content>
      <ion-list>
        <ion-item button @click="deleteMessage">Delete</ion-item>
        <ion-item button @click="deleteMessageForUser">Delete for Me</ion-item>
        <ion-item button @click="editMessage">Edit</ion-item>
      </ion-list>
    </ion-content>
  </ion-popover>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPopover, IonContent, IonList, IonItem } from '@ionic/vue';
import conversationService from '@/services/conversation.service';

export default defineComponent({
  name: 'MessageActionsPopover',
  components: { IonPopover, IonContent, IonList, IonItem },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    messageId: {
      type: String,
      required: true
    },
    conversationId: {
      type: String,
      required: true
    },
    currentUserId: {
      type: String,
      required: true
    }
  },
  emits: ['close', 'messageDeleted', 'messageDeletedForUser', 'editMessage'],
  methods: {
    async deleteMessage() {
      await conversationService.deleteOneMessage(this.conversationId, this.messageId);
      this.$emit('messageDeleted', this.messageId);
      this.closePopover();
    },
    async deleteMessageForUser() {
      await conversationService.deleteOneMessageForUser(this.messageId, this.currentUserId);
      this.$emit('messageDeletedForUser', this.messageId);
      this.closePopover();
    },
    editMessage() {
      this.$emit('editMessage', this.messageId);
      this.closePopover();
    },
    closePopover() {
      this.$emit('close');
    }
  }
});
</script>