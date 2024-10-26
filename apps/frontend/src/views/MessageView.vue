<script lang="ts">
import {defineComponent} from "vue";
import MessageList from "@/components/MessageList.vue";
import MessageForm from "@/components/MessageForm.vue";
export default defineComponent({
  components: {MessageList, MessageForm},
})
</script>

<template>
      <message-list></message-list>
      <message-form></message-form>
</template>
