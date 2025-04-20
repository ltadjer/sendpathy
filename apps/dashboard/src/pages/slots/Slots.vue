<template>
  <div class="flex flex-col gap-8">

    <div class="p-6 rounded-2xl shadow-inner bg-[#f5f5fa] neumorphic-section">
      <h2 class="text-xl font-semibold mb-4">Définir une plage horaire récurrente</h2>

      <VaForm class="flex flex-col gap-4">
        <div class="flex flex-wrap gap-4">
          <VaInput
            v-model="form.startTime"
            label="Heure de début"
            type="time"
            :rules="[validators.required]"
            class="flex-1 min-w-[140px]"
          />
          <VaInput
            v-model="form.endTime"
            label="Heure de fin"
            type="time"
            :rules="[validators.required]"
            class="flex-1 min-w-[140px]"
          />
        </div>

        <div>
          <label class="font-medium mb-2 block">Jours de la semaine :</label>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="(day, index) in daysOfWeek"
              :key="index"
              class="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input type="checkbox" v-model="form.days" :value="index" />
              {{ day }}
            </label>
          </div>
        </div>

        <div class="flex flex-wrap gap-4">
          <VaInput
            v-model="form.startMonth"
            label="Mois de début"
            type="month"
            :rules="[validators.required]"
            class="flex-1 min-w-[160px]"
          />
          <VaInput
            v-model="form.endMonth"
            label="Mois de fin"
            type="month"
            :rules="[validators.required]"
            class="flex-1 min-w-[160px]"
          />
        </div>

        <VaButton type="submit" preset="primary" class="self-end mt-2" @click="generateRecurringSlots">
          Générer les créneaux
        </VaButton>
      </VaForm>
    </div>

    <!-- Calendrier -->
    <div class="calendar-wrapper">
      <h1 class="text-2xl font-bold mb-4">Gestion des disponibilités</h1>
      <vue-cal
        :events="slots"
        @event-click="onSlotClick"
        default-view="week"
        :time-from="8 * 60"
        :time-to="21 * 60"
        :snap-to-time="15"
        style="height: 600px"
        locale="fr"
        :disable-views="['years','year']"
        hide-title
        class="neumorphic-calendar"
      />
      <va-modal v-model="showEditModal" size="small" hide-default-actions>
        <template #header>
          <h1 class="va-h5">Modifier la plage horaire</h1>
        </template>
        <template #default>
          <VaForm class="flex flex-col gap-4">
            <VaDateInput
              v-model="selectedSlot.start"
              label="Date"
              class="w-full"
              disabled
            />
            <VaInput
              v-model="selectedSlot.start"
              label="Heure de début"
              type="time"
              :rules="[validators.required]"
            />
            <VaInput
              v-model="selectedSlot.end"
              label="Heure de fin"
              type="time"
              :rules="[validators.required]"
            />
            <div class="flex justify-end gap-2">
              <VaButton preset="secondary" @click="closeEditModal">Annuler</VaButton>
              <VaButton preset="primary" @click="saveSlotChanges">Enregistrer</VaButton>
            </div>
          </VaForm>
        </template>
      </va-modal>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { getAvailableSlots, createSlots, updateSlot } from '../../services/slots'
import { validators } from '../../services/utils'

const slots = ref([])
const showEditModal = ref(false)
const selectedSlot = ref({ id: null, start: '', end: '' })

type EventItem = { start: Date; end: Date; title: string; content: string; class: string; id: number }

const fetchSlots = async () => {
  try {
    const { data } = await getAvailableSlots()
    const sorted = data.sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )
    const events: EventItem[] = []
    let group: any = null

    sorted.forEach(slot => {
      const rawStart = slot.startTime.replace(/\.000Z$/, '')
      const rawEnd = slot.endTime.replace(/\.000Z$/, '')
      const start = new Date(rawStart)
      const end = new Date(rawEnd)

      if (!slot.isBooked) {
        if (group && group.end.getTime() === start.getTime()) {
          group.end = end
        } else {
          group = {
            start,
            end,
            title: 'Disponible',
            content: '',
            class: 'available',
            id: slot.id
          }
          events.push(group)
        }
      } else {
        events.push({ start, end, title: 'Réservé', content: '', class: 'booked', id: slot.id })
        group = null
      }
    })

    slots.value = events
  } catch (err) {
    console.error('Error fetching slots:', err)
  }
}

const onSlotClick = event => {
  if (event.class === 'booked') return
  const start = event.start as Date
  const end = event.end as Date

  selectedSlot.value = {
    id: event.id,
    start: start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false }),
    end: end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false }),
  }
  showEditModal.value = true
}

const toISOStringWithoutTZ = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00.000Z`
}

const saveSlotChanges = async () => {
  try {
    const [h1, m1] = selectedSlot.value.start.split(':').map(Number)
    const [h2, m2] = selectedSlot.value.end.split(':').map(Number)

    const slotToEdit = slots.value.find(s => s.id === selectedSlot.value.id)
    if (!slotToEdit) return

    const targetDate = new Date(slotToEdit.start)
    targetDate.setHours(0, 0, 0, 0)

    const slotsSameDay = slots.value.filter(s => {
      const sameDate = new Date(s.start)
      sameDate.setHours(0, 0, 0, 0)
      return sameDate.getTime() === targetDate.getTime() && s.class === 'available'
    })

    const updatedSlots = slotsSameDay.map(s => {
      const dateStart = new Date(s.start)
      const dateEnd = new Date(s.start)
      dateStart.setHours(h1, m1, 0, 0)
      dateEnd.setHours(h2, m2, 0, 0)

      return {
        id: s.id,
        startTime: toISOStringWithoutTZ(dateStart),
        endTime: toISOStringWithoutTZ(dateEnd),
      }
    })

    await Promise.all(updatedSlots.map(slot => updateSlot(slot.id, {
      startTime: slot.startTime,
      endTime: slot.endTime
    })))

    await fetchSlots()
    closeEditModal()
  } catch (err) {
    console.error('Error updating slot group:', err)
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedSlot.value = { id: null, start: '', end: '' }
}

const form = ref({
  startTime: '',
  endTime: '',
  days: [],
  startMonth: '',
  endMonth: ''
})

const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

const generateRecurringSlots = async () => {
  const [sh, sm] = form.value.startTime.split(':').map(Number)
  const [eh, em] = form.value.endTime.split(':').map(Number)

  const startDate = new Date(form.value.startMonth + '-01')
  startDate.setHours(sh, sm, 0, 0)

  const endDate = new Date(form.value.endMonth + '-01')
  endDate.setMonth(endDate.getMonth() + 1)
  endDate.setHours(eh, em, 0, 0)

  const dto = {
    startTime: toISOStringWithoutTZ(startDate),
    endTime: toISOStringWithoutTZ(endDate),
    interval: 60
  }

  try {
    const { data: existing } = await getAvailableSlots()
    const overlap = existing.some(s => {
      const a = new Date(s.startTime).getTime()
      const b = new Date(s.endTime).getTime()
      const x = startDate.getTime()
      const y = endDate.getTime()
      return (x >= a && x < b) || (y > a && y <= b)
    })
    if (overlap) {
      console.error('Chevauchement détecté')
      return
    }

    await createSlots(dto)
    await fetchSlots()
  } catch (err) {
    console.error('Error creating slots:', err)
  }
}

onMounted(fetchSlots)
</script>

