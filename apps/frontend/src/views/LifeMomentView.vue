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
    <life-moment-list v-if="!isAccessCodeModalOpen && lifeMoments" :life-moments="lifeMoments" :current-user="currentUser" />
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LifeMomentList from '@/components/LifeMoment/LifeMomentList.vue';
import AccessCodeModal from '@/components/LifeMoment/AccessCodeModal.vue';
import { useLifeMomentStore } from '@/stores/life-moment';
import { useAccountStore } from '@/stores/account';
import { IonPage,IonAvatar, IonHeader, IonToolbar, IonItem, IonTitle, IonButtons, IonButton, } from '@ionic/vue';

export default defineComponent({
  name: 'LifeMomentView',
  components: {
    IonAvatar, IonHeader, IonToolbar, IonItem, IonTitle, IonButtons, IonButton,
    AccessCodeModal,
    LifeMomentList,
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
      console.log('access_code', accessCode);
      if (!accessCode) {
        console.log('No access code');
        this.isAccessCodeModalOpen = true;
        this.hasAccessCode = false;
      } else {
        console.log('Access code found');
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