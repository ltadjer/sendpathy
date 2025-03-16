<template>
  <ion-page>
      <message-list :conversation-id="conversationId" :current-user="currentUser" :conversation="conversation"></message-list>
  </ion-page>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import MessageList from "@/components/Message/MessageList.vue";
import MessageForm from "@/components/Message/MessageForm.vue";
import {IonPage} from "@ionic/vue";
import { useAccountStore } from '@/stores/account';
import { useConversationStore } from '@/stores/conversation'
export default defineComponent({
  components: {MessageList, MessageForm, IonPage},
  data() {
    return {
      conversationId: '',
      conversation: null,
    };
  },
  computed: {
    currentUser() {
      return useAccountStore().user;
    },
  },
  async created() {
    this.conversationId = this.$route.params.conversationId;
    this.conversation = await useConversationStore().fetchOneConversation(this.conversationId);
  },
})
</script>
