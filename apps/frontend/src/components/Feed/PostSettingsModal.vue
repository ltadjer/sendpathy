<template>
  <ion-modal :is-open="true" @didDismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-label>Tags</ion-label>
        <ion-select multiple v-model="localSelectedTags">
          <ion-select-option v-for="tag in tags" :key="tag.id" :value="tag.id">{{ tag.name }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-label>Triggers</ion-label>
        <ion-select multiple v-model="localSelectedTriggers">
          <ion-select-option v-for="trigger in triggers" :key="trigger.id" :value="trigger.id">{{ trigger.name }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-button expand="full" @click="saveSettings">Save</ion-button>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/vue';
import { useTagStore} from '@/stores/tag';
import { useTriggerStore } from '@/stores/trigger';

export default defineComponent({
  name: 'PostSettingsModal',
  components: {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption
  },
  props: {
    selectedTags: {
      type: Array,
      default: () => []
    },
    selectedTriggers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tags: [],
      triggers: [],
      localSelectedTags: [...this.selectedTags],
      localSelectedTriggers: [...this.selectedTriggers]
    };
  },
  methods: {
    async fetchTags() {
      this.tags = await useTagStore().fetchAllTags();
    },
    async fetchTriggers() {
      this.triggers = await useTriggerStore().fetchAllTriggers();
    },
    closeModal() {
      this.$emit('close');
    },
    saveSettings() {
      this.$emit('update:selectedTags', this.localSelectedTags);
      this.$emit('update:selectedTriggers', this.localSelectedTriggers);
      this.closeModal();
    }
  },
  mounted() {
    this.fetchTags();
    this.fetchTriggers();
  }
});
</script>