<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">S'inscrire</h1>
    <p class="text-base mb-4 leading-5">
      Vous avez déjà un compte ?
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary">Se connecter</RouterLink>
    </p>
    <VaInput
      v-model="formData.firstName"
      :rules="[(v) => !!v || 'Le prénom est requis']"
      class="mb-4"
      label="Prénom"
      placeholder="Entrez votre prénom"
    />
    <VaInput
      v-model="formData.lastName"
      :rules="[(v) => !!v || 'Le nom est requis']"
      class="mb-4"
      label="Nom"
      placeholder="Entrez votre nom"
    />
    <div class="flex flex-col items-center mb-4">
      <div class="current-avatar-preview mb-4 flex flex-col items-center">
        <div class="shadow-neumorphism rounded-full p-2">
          <VaAvatar :src="selectedAvatar" size="large" class="shadow-neumorphism-in" />
        </div>
        <p class="mt-2 text-center">Avatar sélectionné</p>
      </div>
      <div class="avatar-selection p-4">
        <div
          v-for="(avatar, index) in avatars"
          :key="index"
          class="shadow-neumorphism rounded-full p-2"
          :class="{ 'shadow-neumorphism-in': avatar === selectedAvatar }"
        >
          <VaAvatar
            :src="avatar"
            size="large"
            class="shadow-neumorphism-in cursor-pointer"
            :class="{ 'selected-avatar': avatar === selectedAvatar }"
            @click="selectAvatar(avatar)"
          />
        </div>
      </div>
      <VaButton preset="primary" size="small" @click="generateAvatars">Générer des avatars</VaButton>
    </div>
    <VaInput
      v-model="formData.email"
      :rules="[(v) => !!v || 'Le champ email est requis', (v) => /.+@.+\..+/.test(v) || 'L\'email doit être valide']"
      class="mb-4"
      label="Email"
      type="email"
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        ref="password1"
        v-model="formData.password"
        :rules="passwordRules"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Mot de passe"
        messages="Le mot de passe doit contenir au moins 8 caractères : lettres, chiffres et caractères spéciaux."
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon
            :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
      <VaInput
        ref="password2"
        v-model="formData.repeatPassword"
        :rules="[
          (v) => !!v || 'Le champ de confirmation du mot de passe est requis',
          (v) => v === formData.password || 'Les mots de passe ne correspondent pas',
        ]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Confirmer le mot de passe"
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon
            :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
    </VaValue>

    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit">Créer un compte</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vuestic-ui'
import { useAuth } from '../../composables/useAuth'

const { registerUser } = useAuth()
const router = useRouter()
const { init } = useToast()

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  repeatPassword: '',
  biography: '',
})

const avatars = ref<string[]>([])
const selectedAvatar = ref<string>('')

const generateAvatars = () => {
  const newAvatars = []
  const backgroundColors = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf']
  for (let i = 0; i < 6; i++) {
    const seed = `${formData.firstName}-${Math.random().toString(36).substr(2, 9)}`
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
    await registerUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      avatar: selectedAvatar.value,
      email: formData.email,
      password: formData.password,
      biography: formData.biography,
    })
    init({
      message: 'Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte avant de vous connecter.',
      color: 'success',
    })
    router.push({ name: 'login' })
  } catch (error) {
    init({
      message: 'Échec de l\'inscription. Veuillez réessayer.',
      color: 'danger',
    })
    console.error(error)
  }
}

const passwordRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || 'Le champ mot de passe est requis',
  (v) => (v && v.length >= 8) || 'Le mot de passe doit contenir au moins 8 caractères',
  (v) => (v && /[A-Za-z]/.test(v)) || 'Le mot de passe doit contenir au moins une lettre',
  (v) => (v && /\d/.test(v)) || 'Le mot de passe doit contenir au moins un chiffre',
  (v) => (v && /[!@#$%^&*(),.?":{}|<>]/.test(v)) || 'Le mot de passe doit contenir au moins un caractère spécial',
]
</script>

<style scoped>
.avatar-selection {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
