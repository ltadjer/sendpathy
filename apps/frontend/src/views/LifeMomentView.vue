<template>
  <ion-page>
    <ion-header>
      <ion-header :translucent="true" class="ion-padding header-page">
        <ion-toolbar>
          <ion-item lines="none" class="ion-no-shadow ion-align-items-center">
            <router-link to="/profil">
              <div class="avatar-container">
                <ion-avatar slot="start">
                  <img alt="User Avatar" :src="currentUser?.avatar" />
                </ion-avatar>
              </div>
            </router-link>
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
    <access-code-modal
      :is-open="isAccessCodeModalOpen"
      :has-access-code="hasAccessCode"
      @update:isOpen="(value) => isAccessCodeModalOpen = value"
      @access-code-set="fetchLifeMoments"
      @access-code-validated="fetchLifeMoments">
    </access-code-modal>
    <ion-content>
      <life-moment-list v-if="!isAccessCodeModalOpen && lifeMoments" :life-moments="lifeMoments" :current-user="currentUser" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LifeMomentList from '@/components/LifeMoment/LifeMomentList.vue';
import AccessCodeModal from '@/components/LifeMoment/AccessCodeModal.vue';
import { useLifeMomentStore } from '@/stores/life-moment';
import { useAccountStore } from '@/stores/account';
import { IonPage,IonAvatar, IonHeader, IonToolbar, IonItem, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/vue';

export default defineComponent({
  name: 'LifeMomentView',
  components: {
    IonAvatar, IonHeader, IonToolbar, IonItem, IonTitle, IonButtons, IonButton,
    AccessCodeModal,
    LifeMomentList,
    IonContent,
    IonPage
  },
  data() {
    return {
      isAccessCodeModalOpen: false,
      hasAccessCode: false,
    };
  },
  computed: {
    lifeMoments() {
      return useLifeMomentStore().lifeMoments.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    currentUser() {
      return useAccountStore().user;
    }
  },
  methods: {
    async fetchLifeMoments() {
      await useLifeMomentStore().fetchLifeMoments();
    },
    async checkAccessCode() {
      if (this.isAccessCodeModalOpen) {
        console.log('Access code modal is already open');
        return;
      }
      const accessCode = useAccountStore().user?.accessCode;
      if (!accessCode) {
        this.isAccessCodeModalOpen = true;
        this.hasAccessCode = false;
      } else {
        this.isAccessCodeModalOpen = true;
        this.hasAccessCode = true;
        await this.fetchLifeMoments();
      }
    }
  },
  async mounted() {
    await this.checkAccessCode();
  }
});
</script>
<style scoped>
@media (min-width: 1024px) {
  ion-router-outlet .ion-page {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ion-content {
    width: 90%
  }
}
</style>