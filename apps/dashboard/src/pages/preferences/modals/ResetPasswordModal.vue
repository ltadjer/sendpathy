<template>
  <VaModal
    max-width="530px"
    :mobile-fullscreen="false"
    hide-default-actions
    model-value
    close-button
    @update:modelValue="emits('cancel')"
  >
    <h1 class="va-h5 mb-4">Reset password</h1>
    <VaForm ref="form" class="space-y-6" @submit.prevent="submit">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VaInput
          v-model="oldPassowrd"
          :rules="oldPasswordRules"
          label="Old password"
          placeholder="Old password"
          required-mark
          type="password"
        />
        <div class="hidden md:block" />
        <VaInput
          v-model="newPassword"
          :rules="newPasswordRules"
          label="New password"
          placeholder="New password"
          required-mark
          type="password"
        />
        <VaInput
          v-model="repeatNewPassword"
          :rules="repeatNewPasswordRules"
          label="Repeat new password"
          placeholder="Repeat new password"
          required-mark
          type="password"
        />
      </div>
      <div class="flex flex-col space-y-2">
        <div class="flex space-x-2 items-center">
          <div>
            <VaIcon :name="newPassword?.length! >= 8 ? 'mso-check' : 'mso-close'" color="secondary" size="20px" />
          </div>
          <p>Must be at least 8 characters long</p>
        </div>
        <div class="flex space-x-2 items-center">
          <div>
            <VaIcon :name="new Set(newPassword).size >= 6 ? 'mso-check' : 'mso-close'" color="secondary" size="20px" />
          </div>
          <p>Must contain at least 6 unique characters</p>
        </div>
      </div>
      <div class="flex flex-col-reverse md:justify-end md:flex-row md:space-x-4">
        <VaButton :style="buttonStyles" preset="secondary" color="secondary" @click="emits('cancel')"> Cancel</VaButton>
        <VaButton :style="buttonStyles" class="mb-4 md:mb-0" type="submit" @click="submit"> Update Password</VaButton>
      </div>
    </VaForm>
  </VaModal>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useForm, useToast } from 'vuestic-ui'
import { useUserStore } from '../../../stores/user-store'

import { buttonStyles } from '../styles'

const oldPassowrd = ref<string>()
const newPassword = ref<string>()
const repeatNewPassword = ref<string>()

const { validate } = useForm('form')
const { init } = useToast()

const store = useUserStore()

const emits = defineEmits(['cancel'])

const submit = async () => {
  if (validate()) {
    try {
      await store.updateUser(store.user.id, { password: newPassword.value })
      init({ message: "Vous avez changé votre mot de passe avec succès.", color: 'success' })
      emits('cancel')
    } catch (error) {
      init({ message: 'Échec de la mise à jour du mot de passe. Veuillez réessayer.', color: 'danger' })
      console.error(error)
    }
  }
}

const oldPasswordRules = [(v: string) => !!v || 'Le champ de l\'ancien mot de passe est requis.']

const newPasswordRules = [
  (v: string) => !!v || 'Le champ du nouveau mot de passe est requis.',
  (v: string) => v?.length >= 8 || 'Doit contenir au moins 8 caractères.',
  (v: string) => new Set(v).size >= 6 || 'Le nouveau mot de passe ne peut pas être identique à l\'ancien.',
  (v: string) => v !== oldPassowrd.value || 'Le nouveau mot de passe ne peut pas être identique à l\'ancien.',
]

const repeatNewPasswordRules = [
  (v: string) => !!v || 'Le champ de confirmation du nouveau mot de passe est requis.',
  (v: string) => v === newPassword.value || 'La confirmation du mot de passe ne correspond pas au nouveau mot de passe.',
]
</script>

<style lang="scss">
// TODO temporary before https://github.com/epicmaxco/vuestic-ui/issues/4020 fix
.va-modal__inner {
  min-width: 326px;
}
</style>
