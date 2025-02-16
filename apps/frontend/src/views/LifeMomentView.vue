<template>
  <access-code-modal
    :is-open="isAccessCodeModalOpen"
    :token="accessToken"
    :has-access-code="hasAccessCode"
    @update:isOpen="(value) => isAccessCodeModalOpen = value"
    @access-code-set="fetchLifeMoments"
    @access-code-validated="fetchLifeMoments">
  </access-code-modal>
  <life-moment-list v-if="!isAccessCodeModalOpen && lifeMoments" :life-moments="lifeMoments" :current-user="currentUser" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LifeMomentList from '@/components/LifeMoment/LifeMomentList.vue';
import AccessCodeModal from '@/components/LifeMoment/AccessCodeModal.vue';
import { useLifeMomentStore } from '@/stores/life-moment';
import { useAccountStore } from '@/stores/account';

export default defineComponent({
  name: 'LifeMomentView',
  components: {
    AccessCodeModal,
    LifeMomentList
  },
  data() {
    return {
      isAccessCodeModalOpen: false,
      hasAccessCode: false,
    };
  },
  computed: {
    accessToken() {
      return useAccountStore().user?.refreshToken;
    },
    lifeMoments() {
      return useLifeMomentStore().lifeMoments;
    },
    currentUser() {
      return useAccountStore().user;
    }
  },
  methods: {
    async fetchLifeMoments() {
      console.log('Fetching life moments', this.accessToken);
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