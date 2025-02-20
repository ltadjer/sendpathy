<template>
  <ion-page>
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
import { IonPage } from '@ionic/vue';

export default defineComponent({
  name: 'LifeMomentView',
  components: {
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