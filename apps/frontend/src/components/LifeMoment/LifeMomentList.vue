<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Journal</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <life-moment-form :lifeMoment="selectedLifeMoment" @lifeMoment-updated="fetchLifeMoments"></life-moment-form>
      <ion-list>
        <ion-item v-for="lifeMoment in lifeMoments" :key="lifeMoment.id" @click="editLifeMoment(lifeMoment)">
          <p>{{ lifeMoment.content }}</p>
          <ion-button slot="end" color="danger" @click.stop="deleteLifeMoment(lifeMoment.id)">Delete</ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton } from '@ionic/vue';
import lifeMomentService from '@/services/lifeMoment.service';
import LifeMomentForm from '@/components/LifeMoment/LifeMomentForm.vue';

export default defineComponent({
  name: 'LifeMomentList',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonButton,
    LifeMomentForm,
  },
  data() {
    return {
      selectedLifeMoment: null,
    };
  },
  props: {
    lifeMoments: {
      type: Array,
      required: true,
    },
  },
  methods: {
    editLifeMoment(lifeMoment) {
      this.selectedLifeMoment = lifeMoment;
    },
    async deleteLifeMoment(lifeMomentId) {
      await lifeMomentService.deleteOneLifeMoment(lifeMomentId);
      await this.fetchLifeMoments();
    }
  },
});
</script>