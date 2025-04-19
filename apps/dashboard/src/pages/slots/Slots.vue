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
          <label class="font-medium mb-2 block">Jours de la semaine :</label>
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
        draggable
        @event-change="onEventChange"
        @event-delete="onEventDelete"
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
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { getAvailableSlots, createSlots, updateSlot, deleteSlot } from '../../services/slots'
import { validators } from '../../services/utils'

const slots = ref([])

const fetchSlots = async () => {
  try {
    const { data } = await getAvailableSlots();
    const sortedSlots = data.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    const groupedSlots = [];
    let currentGroup = null;

    sortedSlots.forEach((slot) => {
      const start = new Date(slot.startTime);
      const end = new Date(slot.endTime);

      if (!slot.isBooked) {
        if (currentGroup && currentGroup.end.getTime() === start.getTime()) {
          currentGroup.end = end;
        } else {
          currentGroup = { start, end, title: 'Disponible', content: '' , class: 'available' };
          groupedSlots.push(currentGroup);
        }
      } else {
        groupedSlots.push({ start, end, title: 'Réservé', content: '', class: 'booked' });
        currentGroup = null;
      }
    });

    slots.value = groupedSlots;
  } catch (error) {
    console.error('Error fetching slots:', error);
  }
};

const onEventChange = async (event) => {
  try {
    await updateSlot(event.id, {
      startTime: event.start,
      endTime: event.end,
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du créneau :', error)
  }
}

const onEventDelete = async (event) => {
  try {
    await deleteSlot(event.id)
    slots.value = slots.value.filter(e => e.id !== event.id)
  } catch (error) {
    console.error('Erreur lors de la suppression du créneau :', error)
  }
}

const form = ref({
  startTime: '',
  endTime: '',
  days: [],
  startMonth: '',
  endMonth: '',
})

const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

const generateRecurringSlots = async () => {
  const startDate = new Date(form.value.startMonth + '-01');
  const endDate = new Date(form.value.endMonth + '-01');
  endDate.setMonth(endDate.getMonth() + 1);

  const [startHour, startMinute] = form.value.startTime.split(':').map(Number);
  const [endHour, endMinute] = form.value.endTime.split(':').map(Number);

  const startTime = new Date(startDate);
  startTime.setHours(startHour, startMinute, 0);

  const endTime = new Date(endDate);
  endTime.setHours(endHour, endMinute, 0);

  const createSlotsDto = {
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    interval: 60,
  };

  try {
    console.log('Création des créneaux :', createSlotsDto);
    await createSlots(createSlotsDto);
    await fetchSlots();
  } catch (error) {
    console.error('Erreur lors de la création des créneaux :', error);
  }
};

onMounted(fetchSlots)
</script>
