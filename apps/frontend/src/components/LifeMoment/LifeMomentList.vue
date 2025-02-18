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
      <life-moment-form-modal v-if="isLifeMomentFormModalOpen" :lifeMoment="selectedLifeMoment" @close="closeLifeMomentFormModal" />
      <ion-list class="ion-padding">
        <ion-item class="ion-margin-bottom" lines="none" v-for="lifeMoment in lifeMoments" :key="lifeMoment.id" @click="editLifeMoment(lifeMoment)">
          <ion-grid>
            <ion-row>
              <ion-col>
                <ion-grid>
                  <ion-row>
                    <ion-col class="ion-align-items-start">
                        <span style="font-size: 2rem">{{ lifeMoment.emotion }}</span><br />
                        <ion-text class="ion-margin-top">{{ lifeMoment.content }}</ion-text>
                    </ion-col>
                  </ion-row>
                  <ion-row class="media-grid" :class="`media-count-${lifeMoment.contents.length}`">
                    <template v-for="(content, index) in lifeMoment.contents" :key="content.id">
                      <ion-col v-if="index < 4" class="media-item">
                        <img v-if="content.type.startsWith('image/')" :src="`https://api.sendpathy.aaa${content.fileUrl}`" class="media-content" />
                        <video v-else-if="content.type.startsWith('video/')" :src="`https://api.sendpathy.aaa${content.fileUrl}`"  controls class="media-content"></video>
                      </ion-col>
                    </template>
                    <ion-col v-if="lifeMoment.contents.length > 4" class="overlay-more">
                      +{{ lifeMoment.contents.length - 4 }}
                    </ion-col>
                  </ion-row>
                  <ion-row class="separator ion-margin-top"></ion-row>
                  <ion-row class="ion-padding-top">
                    <ion-col>
                      <ion-text>{{ formatDate(lifeMoment.createdAt) }}</ion-text>
                    </ion-col>
                    <ion-col size="2" class="ion-text-end">
                      <ion-icon class="custom-icon" :id="'popover-button-' + lifeMoment.id" @click.stop :icon="ellipsisHorizontalOutline"></ion-icon>
                      <ion-popover :trigger="'popover-button-' + lifeMoment.id" :dismiss-on-select="true" side="top" alignment="end">
                        <ion-list>
                          <ion-item class="ion-input-spacing" lines="none" :button="true" :detail="false" @click.stop="deleteLifeMoment(lifeMoment.id)">Supprimer</ion-item>
                        </ion-list>
                      </ion-popover>
                    </ion-col>
                </ion-row>
                </ion-grid>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton, IonButtons, IonAvatar, IonGrid, IonRow, IonCol, IonIcon, IonPopover, IonText } from '@ionic/vue';
import { useLifeMomentStore } from '@/stores/life-moment';
import LifeMomentFormModal from '@/components/LifeMoment/LifeMomentFormModal.vue';
import { ellipsisHorizontalOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'LifeMomentList',
  components: {
    IonButtons,
    IonAvatar,
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
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonPopover,
    IonText,
    LifeMomentFormModal
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
      this.isLifeMomentFormModalOpen = true;
    },
    async deleteLifeMoment(lifeMomentId) {
      await useLifeMomentStore().deleteLifeMoment(lifeMomentId);
    },
    closeLifeMomentFormModal() {
      this.isLifeMomentFormModalOpen = false;
    },
    formatDate(dateString) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    }
  },
  setup() {
    return { ellipsisHorizontalOutline };
  },
  mounted() {
    console.log('LifeMomentList mounted');
    console.log('LifeMoments', this.lifeMoments);
  },
});
</script>
<style scoped>
.media-grid {
  display: grid;
  gap: 8px;
  width: 100%;
}
.media-count-1 {
  grid-template-columns: 1fr;
}
.media-count-2 {
  grid-template-columns: 1fr 1fr;
}
.media-count-3 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
}
.media-count-4, .media-count-5 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
.media-item {
  position: relative;
}
.media-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
.overlay-more {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 1.5rem;
  border-radius: 8px;
}

.separator {
  height: 2px;
  background-color: #ccc;
  box-shadow: var(--neumorphism-in-shadow);
}
</style>
