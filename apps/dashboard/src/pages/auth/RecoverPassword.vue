<template>
  <VaForm ref="passwordForm" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Mot de passe oublié ?</h1>
    <p class="text-base mb-4 leading-5">
      Si vous avez oublié votre mot de passe, ne vous inquiétez pas. Entrez simplement votre adresse e-mail ci-dessous, et nous vous enverrons un e-mail avec un lien pour changer votre mot de passe.
    </p>
    <VaInput
      v-model="email"
      :rules="[(v) => !!v || 'Le champ e-mail est requis']"
      class="mb-4"
      label="Entrez votre e-mail"
      type="email"
    />
    <VaButton class="w-full mb-2" @click="submit">Envoyer le mot de passe</VaButton>
    <VaButton :to="{ name: 'login' }" class="w-full" preset="secondary" @click="submit">Retour</VaButton>
  </VaForm>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useForm, useToast } from 'vuestic-ui'
import { useAuth } from '../../composables/useAuth'

const { requestPasswordReset } = useAuth()
const email = ref('')
const form = useForm('passwordForm')
const { init } = useToast()

const submit = async () => {
  if (form.validate()) {
    try {
      await requestPasswordReset(email.value)
      init({ message: 'E-mail de réinitialisation du mot de passe envoyé avec succès.', color: 'success' })
    } catch (error) {
      init({ message: 'Échec de l\'envoi de l\'e-mail de réinitialisation du mot de passe.', color: 'danger' })
    }
  }
}
</script>
