<template>
  <ion-toast
    class="ion-shadow-out ion-border-radius"
    :is-open="toastStore.isOpen"
    :message="toastStore.message"
    :duration="duration"
    :color="toastStore.color"
    @didDismiss="handleDismiss"
  ></ion-toast>
</template>

<script>
import { defineComponent } from 'vue';
import { IonToast } from '@ionic/vue';
import { useToastStore } from '@/stores/toast';

export default defineComponent({
  name: 'ToastMessage',
  components: { IonToast },
  setup() {
    const toastStore = useToastStore();

    const handleDismiss = () => {
      toastStore.hideToast();
      toastStore.resetToast();
    };

    return {
      toastStore,
      duration: 2000,
      handleDismiss,
    };
  },
});
</script>