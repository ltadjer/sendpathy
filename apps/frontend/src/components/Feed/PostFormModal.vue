<template>
  <ion-modal :is-open="true" @didDismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <custom-button @click="closeModal" :icon="closeOutline"></custom-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <post-form :post="post" @post-updated="closeModal" :current-user="currentUser" @close="closeModal()"/>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';
import PostForm from '@/components/Feed/PostForm.vue';
import CustomButton from '@/components/Commun/CustomButton.vue'

export default defineComponent({
  name: 'PostFormModal',
  components: { CustomButton, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, PostForm },
  props: {
    post: {
      type: Object,
    },
    currentUser: {
      type: Object,
      required: true
    }
  },
  setup() {
    return { closeOutline };
  },
  emits: ['close'],
  methods: {
    closeModal() {
      this.$emit('close');
    }
  }
});
</script>