<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Consultations</h1>

    <div class="flex flex-col md:flex-row gap-2 mb-4">
      <va-button-toggle
        v-model="viewMode"
        :options="[
          { label: 'Liste', value: 'table' },
          { label: 'Calendrier', value: 'calendar' },
          { label: 'Cartes', value: 'cards' },
        ]"
        color="background-element"
        border-color="background-element"
      />
      <va-button @click="fetchReservations">Rafraîchir</va-button>

    </div>



    <!-- Vue tableau -->
    <va-data-table
      v-if="viewMode === 'table'"
      :items="filteredReservations"
      :columns="columns"
      class="mt-6"
    >
      <template #cell(avatar)="{ rowData }">
        <VaAvatar
          :src="rowData.avatar
      ? rowData.avatar
      : ''"
          size="small"
          alt="User Avatar"
        />
      </template>

      <template #cell(status)="{ rowData }">
        <VaBadge
          :text="rowData.status === 'confirmed' ? 'Confirmée' : 'Annulée'"
          :color="rowData.status === 'confirmed' ? 'success' : 'danger'"
        />
      </template>

      <template #cell(actions)="{ rowData }">
        <va-button size="small" @click="openEditModal(rowData)" preset="primary"
                   icon="mso-edit"
                   aria-label="Éditer"/>

      </template>


    </va-data-table>

    <ReservationCards
      v-else-if="viewMode === 'cards'"
      :reservations="filteredReservations"
      :loading="isLoading"
      @edit="openEditModal"
      @delete="deleteReservation"
    />

    <!-- Vue calendrier -->
    <vue-cal
      v-else
      :events="calendarEvents"
      style="height: 600px"
      default-view="month"
      @event-click="onCalendarEventClick"
      hide-title
      :disable-views="['years','year']"
      locale="fr"
      :time-from="8 * 60"
      :time-to="21 * 60"
      :snap-to-time="15"
      class="neumorphic-calendar"
    />

    <!-- Modal d'édition -->
    <va-modal v-model="showEditModal" size="small" hide-default-actions mobile-fullscreen
              close-button :before-cancel="beforeEditFormModalClose">
      <template #header>
        <h1 class="va-h5">Modifier la réservation</h1>
      </template>
      <template #default>
        <EditReservationForm
          :reservation="reservationToEdit"
          @save="onReservationSaved"
          @close="closeEditModal"
        />
      </template>
    </va-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getReservations } from '../../services/reservation'
import EditReservationForm from './widgets/EditReservationForm.vue'
import ReservationCards from './widgets/ReservationCards.vue'
import VueCal from 'vue-cal'
import { useModal } from 'vuestic-ui'
import 'vue-cal/dist/vuecal.css'

const reservations = ref([])
const filters = ref({
  status: 'confirmed',
})
const viewMode = ref('calendar') // 👈 table ou calendar
const isLoading = ref(false)

const columns = [
  { key: 'avatar', label: 'Avatar' },
  { key: 'userName', label: 'Utilisateur' },
  { key: 'therapistName', label: 'Thérapeute' },
  { key: 'date', label: 'Date du rendez-vous' },
  { key: 'status', label: 'Statut' },
  { key: 'createdAt', label: 'Créée le' },
  { key: 'actions', label: 'Actions' },
]

const showEditModal = ref(false)
const reservationToEdit = ref(null)

const { confirm } = useModal()

const beforeEditFormModalClose = async (hide) => {
  if (reservationToEdit.value?.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: 'Le formulaire contient des modifications non enregistrées. Voulez-vous vraiment le fermer ?',
      size: 'small',
    })
    if (agreed) {
      hide()
    }
  } else {
    hide()
  }
}

const fetchReservations = async () => {
  isLoading.value = true
  try {
    const { data } = await getReservations()
    reservations.value = data.map(r => ({
      id: r.id,
      avatar: r.user?.avatar,
      userName: r.user?.username,
      therapistName: r.slot?.therapist?.firstName
        ? `${r.slot.therapist.firstName} ${r.slot.therapist.lastName}`
        : 'Inconnu',
      date: new Date(r.slot?.startTime).toLocaleString(),
      start: new Date(r.slot?.startTime),
      end: new Date(r.slot?.endTime),
      status: r.isCancelled ? 'cancelled' : 'confirmed',
      isCancelled: r.isCancelled,
      createdAt: new Date(r.createdAt).toLocaleDateString(),
    }))
    console.log('Fetched reservations:', reservations.value)
  } catch (error) {
    console.error('Error fetching reservations:', error)
  } finally {
    isLoading.value = false
  }
}

const openEditModal = (reservation) => {
  reservationToEdit.value = reservation
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  reservationToEdit.value = null
}

const onReservationSaved = () => {
  fetchReservations()
  closeEditModal()
}

const filteredReservations = computed(() =>
  reservations.value.filter(r => r.status === filters.value.status)
)

const calendarEvents = computed(() =>
  filteredReservations.value.map(r => ({
    title: `<div style="display: flex; align-items: center;">
              <img src="${r.avatar}" alt="Avatar" style="width: 24px; height: 24px; border-radius: 50%; margin-right: 8px;" />
              ${r.userName}
            </div>`,
    start: r.start,
    end: r.end,
    content: r,
  }))
)

const onCalendarEventClick = async (calEvent) => {
  console.log('Event clicked:', calEvent)
  const { content } = calEvent
  const agreed = await confirm({
    maxWidth: '380px',
    message: `Voulez-vous modifier la réservation pour ${content.userName} ?`,
    size: 'small',
  })
  if (agreed) {
    openEditModal(content)
  }
}

onMounted(fetchReservations)
</script>
