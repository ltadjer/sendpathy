<template>
  <VaForm ref="resetForm" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Réinitialisez votre mot de passe</h1>
    <VaInput
      v-model="newPassword"
      :rules="[(v) => !!v || 'Le mot de passe est requis']"
      class="mb-4"
      label="Nouveau mot de passe"
      type="password"
    />
    <VaButton class="w-full" @click="submit">Réinitialiser le mot de passe</VaButton>
  </VaForm>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { resetPassword } from '../../services/auth'

const newPassword = ref('')
const form = useForm('resetForm')
const route = useRoute()
const router = useRouter()
const { init } = useToast()

const submit = async () => {
  if (form.validate()) {
    try {
      const token = route.query.token as string
      await resetPassword(token, newPassword.value)
      init({ message: 'Mot de passe réinitialisé avec succès..', color: 'success' })
      router.push({ name: 'login' })
    } catch (error) {
      init({ message: 'Échec de réinitialisation de mot de passe. Veillez réessayer.', color: 'danger' })
    }
  }
}
</script>
