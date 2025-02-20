<template>
  <ion-page>
      <message-list :conversation-id="conversationId"></message-list>
  </ion-page>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import MessageList from "@/components/MessageList.vue";
import MessageForm from "@/components/MessageForm.vue";
import {IonPage} from "@ionic/vue";
export default defineComponent({
  components: {MessageList, MessageForm, IonPage},
  created() {
    console.log(this.$route.params.id);
    this.conversationId = this.$route.params.id;
  },
})
</script>
