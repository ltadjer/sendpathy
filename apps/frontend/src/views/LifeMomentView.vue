<template>
  <access-code-modal
    :is-open="isAccessCodeModalOpen"
    :token="getAccessToken"
    :has-access-code="hasAccessCode"
    @update:isOpen="(value) => isAccessCodeModalOpen = value"
    @access-code-set="fetchLifeMoments"
    @access-code-validated="fetchLifeMoments">
  </access-code-modal>
  <life-moment-list v-if="!isAccessCodeModalOpen && lifeMoments" :life-moments="lifeMoments" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LifeMomentList from '@/components/LifeMoment/LifeMomentList.vue';
import AccessCodeModal from '@/components/LifeMoment/AccessCodeModal.vue';
import { useLifeMomentStore } from '@/stores/lifeMoment';

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
  async created() {
    await useLifeMomentStore.fetchLifeMoments();
  },
  computed: {
    getAccessToken() {
      return localStorage.getItem('refresh_token');
    },
    lifeMoments() {
      return useLifeMomentStore().lifeMoments;
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
      const accessCode = localStorage.getItem('access_code');
      console.log('access_code', accessCode);
      if (!accessCode || accessCode === 'null') {
        console.log('No access code');
        this.isAccessCodeModalOpen = true;
        this.hasAccessCode = false;
      } else {
        console.log('Access code found');
        this.isAccessCodeModalOpen = true;
        this.hasAccessCode = true;
      }
    }
  },
  async mounted() {
      await this.checkAccessCode();
    }
});
</script>