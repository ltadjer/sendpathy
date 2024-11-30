<template>
  <RouterView />
  <main-header />
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import MainHeader from '@/components/Commun/MainHeader.vue';
export default defineComponent({
  components: {
    MainHeader
  }
});
</script>