<template>
  <VaModal
    :mobile-fullscreen="false"
    size="small"
    hide-default-actions
    max-width="380px"
    model-value
    close-button
    @update:modelValue="emits('cancel')"
  >
    <h1 class="va-h5 mb-4">Modifier mon profil</h1>
    <VaForm ref="form" @submit.prevent="submit">
      <div class="flex flex-col items-center mb-4">
        <div class="current-avatar-preview mb-4 flex flex-col items-center">
          <div  class="shadow-neumorphism rounded-full p-2">
            <VaAvatar :src="selectedAvatar" size="large" class="shadow-neumorphism-in"/>
          </div>
          <p class="mt-2 text-center">Avatar actuel</p>
        </div>

        <div class="avatar-selection p-4">
          <div  v-for="(avatar, index) in avatars"
                :key="index"  class="shadow-neumorphism rounded-full p-2"
                :class="{ 'shadow-neumorphism-in': avatar === selectedAvatar }">
          <VaAvatar
            :src="avatar"
            size="large"
            class="shadow-neumorphism-in cursor-pointer"
            :class="{ 'selected-avatar ': avatar === selectedAvatar }"
            @click="selectAvatar(avatar)"
          />
          </div>
        </div>
        <VaButton preset="primary" size="small" @click="generateAvatars">Générer des avatars</VaButton>
      </div>
      <VaInput v-model="store.user.firstName" class="mb-4" label="Prénom" placeholder="Prénom" />
      <VaInput v-model="store.user.lastName" class="mb-4" label="Nom" placeholder="Nom" />
      <div class="flex flex-col-reverse md:flex-row md:items-center md:justify-end md:space-x-4">
        <VaButton :style="buttonStyles" preset="secondary" color="secondary" @click="emits('cancel')"> Cancel</VaButton>
        <VaButton :style="buttonStyles" class="mb-4 md:mb-0" type="submit" @click="submit"> Save</VaButton>
      </div>
    </VaForm>
  </VaModal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '../../../stores/user-store'
import { buttonStyles } from '../styles'

const store = useUserStore()
const avatars = ref<string[]>([])
const selectedAvatar = ref<string>(store.user.avatar)

const emits = defineEmits(['cancel'])

const generateAvatars = () => {
  const newAvatars = []
  const backgroundColors = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf']
  for (let i = 0; i < 6; i++) {
    const seed = `${store.user.firstName}-${Math.random().toString(36).substr(2, 9)}`
    const backgroundColor = backgroundColors[i % backgroundColors.length]
    newAvatars.push(`https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&backgroundColor=${backgroundColor}`)
  }
  avatars.value = newAvatars
}

const selectAvatar = (avatar: string) => {
  selectedAvatar.value = avatar
}

const submit = async () => {
  try {
    await store.updateUser(store.user.id, {
      lastName: store.user.lastName,
      firstName: store.user.firstName,
      avatar: selectedAvatar.value })
    emits('cancel')
  } catch (error) {
    console.error('Error updating profile:', error)
  }
}
</script>

<style lang="scss" scoped>
.avatar-selection {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

</style>
