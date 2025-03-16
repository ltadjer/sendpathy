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
      <life-moment-form :lifeMoment="lifeMoment" @close="closeModal()"/>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';
import LifeMomentForm from '@/components/LifeMoment/LifeMomentForm.vue';
import CustomButton from '@/components/Commun/CustomButton.vue'

export default defineComponent({
  name: 'LifeMomentFormModal',
  components: { CustomButton, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, LifeMomentForm },
  props: {
    lifeMoment: {
      type: Object,
    },
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