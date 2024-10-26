<template>
      <message-list :conversation-id="conversationId"></message-list>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import MessageList from "@/components/MessageList.vue";
import MessageForm from "@/components/MessageForm.vue";
export default defineComponent({
  components: {MessageList, MessageForm},
  created() {
    console.log(this.$route.params.id);
    this.conversationId = this.$route.params.id;
  },
})
</script>
