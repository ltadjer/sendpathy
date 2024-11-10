<template>
  <access-code-modal
    :is-open="isAccessCodeModalOpen"
    :token="getAccessToken"
    :has-access-code="hasAccessCode"
    @update:isOpen="isAccessCodeModalOpen = $event"
    @access-code-set="fetchLifeMoments"
    @access-code-validated="fetchLifeMoments">
  </access-code-modal>
  <life-moment-list v-if="!isAccessCodeModalOpen" :life-moments="lifeMoments" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LifeMomentList from '@/components/LifeMoment/LifeMomentList.vue';
import AccessCodeModal from '@/components/LifeMoment/AccessCodeModal.vue';
import lifeMomentService from '@/services/lifeMoment.service';
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
      lifeMoments: [],
      hasAccessCode: false,
    };
  },
  computed: {
    getAccessToken() {
      return localStorage.getItem('refresh_token');
    }
  },
  methods: {
    async fetchLifeMoments() {
      try {
        this.lifeMoments = await lifeMomentService.fetchAllLifeMoments();
      } catch (error) {
        if (error.response && error.response.data.message === 'Please set an access code before accessing life moments') {
          this.isAccessCodeModalOpen = true;
        } else {
          console.error('Error fetching life moments:', error);
        }
      }
    },
    checkAccessCode() {
      const accessCode = localStorage.getItem('access_code');
      console.log('access_code', accessCode);
      if (!accessCode) {
        this.isAccessCodeModalOpen = true;
        this.hasAccessCode = false;
      } else {
        this.isAccessCodeModalOpen = true;
        this.hasAccessCode = true;
      }
    }
  },
  mounted() {
    this.checkAccessCode();
  }
});
</script>