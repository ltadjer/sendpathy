<script setup lang="ts">
import { PropType } from 'vue'

const props = defineProps({
  reservations: {
    type: Array as PropType<
      Array<{
        id: string
        userName: string
        therapistName: string
        start: Date
        end: Date
        status: 'confirmed' | 'cancelled'
      }>
    >,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

defineEmits<{
  (event: 'edit', reservation: any): void
  (event: 'delete', reservation: any): void
}>()
</script>

<template>
  <VaInnerLoading
    v-if="reservations.length > 0 || loading"
    :loading="loading"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[4rem]"
  >
    <VaCard
      v-for="reservation in reservations"
      :key="reservation.id"
      :style="{ '--va-card-outlined-border': '1px solid var(--va-background-element)' }"
      outlined
    >
      <VaCardContent class="flex flex-col h-full">
        <div class="text-[var(--va-secondary)]">
          {{ new Date(reservation.start).toLocaleDateString() }}
        </div>
        <div class="flex flex-col items-center gap-4 grow">
          <VaAvatar
            :src="reservation.avatar"
            size="large"
            alt="User Avatar"
          />
          <h4 class="va-h4 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
            {{ reservation.userName }}
          </h4>
          <p>
            <span class="text-[var(--va-secondary)]">Thérapeute : </span>
            <span v-if="reservation.therapistName">
              {{ reservation.therapistName }}
            </span>
          </p>
            <VaBadge
              :text="reservation.status === 'confirmed' ? 'Confirmée' : 'Annulée'"
              :color="reservation.status === 'confirmed' ? 'success' : 'danger'"
            />
        </div>
        <VaDivider class="my-6" />
        <div class="flex justify-between">
          <VaButton
            preset="secondary"
            icon="mso-edit"
            color="secondary"
            @click="$emit('edit', reservation)"
          />
          <VaButton
            preset="secondary"
            icon="mso-delete"
            color="danger"
            @click="$emit('delete', reservation)"
          />
        </div>
      </VaCardContent>
    </VaCard>
  </VaInnerLoading>
  <div v-else class="p-4 flex justify-center items-center text-[var(--va-secondary)]">
    Aucune consultation trouvée
  </div>
</template>
