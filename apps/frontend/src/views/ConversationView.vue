<template>
    <ConversationList />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ConversationList from '@/components/ConversationList.vue';

export default defineComponent({
  name: 'ConversationView',
  components: {
    ConversationList
  }
});
</script>