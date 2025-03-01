<template>
  <ion-footer class="ion-padding footer-page">
    <ion-toolbar>
      <form @submit.prevent="sendMessage" class="message-form">
        <ion-item lines="none" class="ion-no-shadow">
          <ion-input class="ion-margin-top ion-margin-bottom" v-model="messageContent" placeholder="Votre message" required></ion-input>
          <custom-button :icon="sendOutline" slot="end" />
        </ion-item>
      </form>
    </ion-toolbar>

  </ion-footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonInput, IonButton, IonIcon, IonFooter, IonToolbar, IonItem  } from '@ionic/vue';
import WebSocketService from '@/services/websocket.service';
import CustomButton from '@/components/Commun/CustomButton.vue';
import { sendOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'MessageForm',
  components: { CustomButton, IonInput, IonButton, IonIcon, IonFooter, IonToolbar, IonItem },
  data() {
    return {
      messageContent: ''
    };
  },
  props: {
    conversationId: {
      type: String,
      required: true
    },
    senderName: {
      type: String,
      required: true
    },
    receiverId: {
      type: String,
      required: true
    }
  },
  setup() {
    return { sendOutline };
  },
  emits: ['newMessage'],
  methods: {
    sendMessage() {
      const message = {
        content: this.messageContent,
        receiverId: this.receiverId,
        senderName: this.senderName,
        conversationId: this.conversationId
      };
      WebSocketService.emit('message', message);
      this.messageContent = '';
      this.$emit('newMessage', message);
    }
  }
});
</script>

<style scoped>
ion-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}

ion-button {
  --padding-start: 1rem;
  --padding-end: 1rem;
}

</style>