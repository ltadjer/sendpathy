<template>
  <ion-page>
    <ConversationList />
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ConversationList from '@/components/ConversationList.vue';
import { IonPage } from '@ionic/vue';

export default defineComponent({
  name: 'ConversationView',
  components: {
    ConversationList,
    IonPage
  }
});
</script>