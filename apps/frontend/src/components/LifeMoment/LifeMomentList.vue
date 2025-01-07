<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Journal</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <life-moment-form :lifeMoment="selectedLifeMoment"></life-moment-form>
      <ion-list>
        <ion-item v-for="lifeMoment in lifeMoments" :key="lifeMoment.id" @click="editLifeMoment(lifeMoment)">
          <span>{{ lifeMoment.emotion }}</span>
          <p>{{ lifeMoment.content }}</p>
          <div v-for="content in lifeMoment.contents" :key="content.id">
            <img v-if="content.type.startsWith('image/')" :src="`https://api.sendpathy.aaa${content.fileUrl}`" />
            <video v-else-if="content.type.startsWith('video/')" :src="`https://api.sendpathy.aaa${content.fileUrl}`" controls></video>
            <audio v-else-if="content.type.startsWith('audio/')" :src="`https://api.sendpathy.aaa${content.fileUrl}`" controls></audio>
          </div>
          <ion-button slot="end" color="primary" @click.stop="editLifeMoment(lifeMoment)">Edit</ion-button>
          <ion-button slot="end" color="danger" @click.stop="deleteLifeMoment(lifeMoment.id)">Delete</ion-button>

        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton } from '@ionic/vue';
import LifeMomentForm from '@/components/LifeMoment/LifeMomentForm.vue';
import { useLifeMomentStore } from '@/stores/life-moment';

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
      await useLifeMomentStore().deleteLifeMoment(lifeMomentId);
    },
  },
});
</script>