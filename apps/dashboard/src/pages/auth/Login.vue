<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Se connecter</h1>
    <p class="text-base mb-4 leading-5">
      Vous n'avez pas de compte?&nbsp;
      <RouterLink :to="{ name: 'signup' }" class="font-semibold text-primary">S'inscrire</RouterLink>
    </p>

    <VaInput
      v-model="formData.email"
      :rules="[validators.required, validators.email]"
      class="mb-4"
      label="Email"
      type="email"
    />

    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="formData.password"
        :rules="[validators.required]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Password"
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

    <div class="auth-layout__options flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <RouterLink :to="{ name: 'recover-password' }" class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-primary">
        Mot de passe oublié?
      </RouterLink>
    </div>

    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit">Connexion</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { validators } from '../../services/utils'
import { useAuth } from '../../composables/useAuth'

const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()
const { loginUser } = useAuth()

const formData = reactive({
  email: '',
  password: '',
  keepLoggedIn: false,
})

const submit = async () => {
  const isValid = await validate()
  if (!isValid) return

  try {
    await loginUser(formData.email, formData.password)
    init({ message: "Vous vous êtes connecté avec succès", color: 'success' })
    push({ name: 'dashboard' })
  } catch (err) {
    init({ message: 'Échec de la connexion. Veuillez vérifier vos identifiants.', color: 'danger' })
  }
}
</script>
