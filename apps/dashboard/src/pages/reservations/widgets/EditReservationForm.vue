<script setup lang="ts">
import { ref, watch } from 'vue'
import { updateReservationStatus } from '../../../services/reservation'

const props = defineProps({
  reservation: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['save', 'close'])

const isCancelled = ref(props.reservation.isCancelled)

// Synchronize the local variable with the prop if it changes
watch(() => props.reservation.isCancelled, (newValue) => {
  isCancelled.value = newValue
})

const onSave = async () => {
  try {
    console.log('Saving reservation with ID:', props.reservation.id, isCancelled.value)
    await updateReservationStatus(props.reservation.id, { isCancelled: isCancelled.value.value })
    emit('save') // Notify parent of successful save
  } catch (error) {
    console.error('Error updating reservation:', error)
  }
}
</script>

<template>
  <VaForm ref="edit-reservation-form" class="flex flex-col gap-4">
    <div class="flex flex-col sm:flex-row gap-4">
      <VaInput v-model="props.reservation.userName" label="Utilisateur" disabled class="w-full sm:w-1/2" />
      <VaInput v-model="props.reservation.therapistName" label="Thérapeute" disabled class="w-full sm:w-1/2" />
    </div>
    <VaDateInput v-model="props.reservation.start" label="Date" class="w-full" disabled />

    <div class="flex flex-col sm:flex-row gap-4">
      <VaTimeInput v-model="props.reservation.start" label="Début" class="w-full sm:w-1/2" disabled />
      <VaTimeInput v-model="props.reservation.end" label="Fin" class="w-full sm:w-1/2" disabled />
    </div>

    <VaSelect
      v-model="isCancelled"
      label="Statut"
      :options="[
        { text: 'Confirmée', value: false },
        { text: 'Annulée', value: true },
      ]"
      class="w-full sm:w-1/2"
    />

    <div class="flex gap-2 flex-col-reverse sm:flex-row justify-end mt-4">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Annuler</VaButton>
      <VaButton @click="onSave">Enregistrer</VaButton>
    </div>
  </VaForm>
</template>
