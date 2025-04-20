<template>
  <div class="shadow-neumorphism rounded-full p-2">
  <VaAvatar
    size="large"
    :src="store.user?.avatar ? store.user.avatar : ''"
    class="shadow-neumorphism-in"
  ></VaAvatar>
  </div>
  <div class="flex flex-col justify-center">
    <h2 class="text-[28px] md:text-[32px] leading-10 font-bold">
      {{ store.user?.firstName || '' }} {{ store.user?.lastName || '' }}
    </h2>
    <div class="flex space-x-1 text-[13px] leading-4">
      <p>Member since</p>
      <p>{{ store.user?.createdAt }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '../../../stores/user-store'

const store = useUserStore()
console.log('store', store.user)
</script>
