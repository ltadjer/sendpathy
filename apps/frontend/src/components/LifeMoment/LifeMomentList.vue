<template>
  <ion-page>
    <ion-header>
      <ion-header :translucent="true" class="ion-padding header-page">
        <ion-toolbar>
          <ion-item lines="none" class="ion-no-shadow ion-align-items-center">
            <div class="avatar-container">
              <ion-avatar slot="start">
                <img alt="User Avatar" :src="currentUser?.avatar" />
              </ion-avatar>
            </div>
            <ion-title>Moments de vie</ion-title>
          </ion-item>
          <ion-buttons slot="end">
            <ion-button size="small" class="ion-no-shadow">
              <img alt="Logo" src="@/assets/logo.png" width="50px" />
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

    </ion-header>
    <ion-content>
      <life-moment-form-modal  v-if="isLifeMomentFormModalOpen" :lifeMoment="selectedLifeMoment" @close="closeLifeMomentFormModal" />
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
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton, IonButtons,
IonAvatar } from '@ionic/vue';
import LifeMomentForm from '@/components/LifeMoment/LifeMomentForm.vue';
import { useLifeMomentStore } from '@/stores/life-moment';
import PostFormModal from '@/components/Feed/PostFormModal.vue'

export default defineComponent({
  name: 'LifeMomentList',
  components: {
    PostFormModal,
    IonButtons, IonAvatar,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonButton,
    IonButtons,
    IonAvatar,
    LifeMomentForm,
  },
  data() {
    return {
      selectedLifeMoment: null,
      isLifeMomentFormModalOpen: false,
    };
  },
  props: {
    lifeMoments: {
      type: Array,
      required: true,
    },
    currentUser: {
      type: Object,
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
    closeLifeMomentFormModal() {
      this.isLifeMomentFormModalOpen = false;
    },
  },
});
</script>