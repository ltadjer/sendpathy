<template>
  <ion-page>
      <message-list :conversation-id="conversationId" :current-user-id="currentUser"></message-list>
  </ion-page>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import MessageList from "@/components/MessageList.vue";
import MessageForm from "@/components/MessageForm.vue";
import {IonPage} from "@ionic/vue";
import { useAccountStore } from '@/stores/account'
export default defineComponent({
  components: {MessageList, MessageForm, IonPage},
  created() {
    this.conversationId = this.$route.params.id;
  },
  computed: {
    currentUser() {
      return useAccountStore().user;
    },
  }
})
</script>
