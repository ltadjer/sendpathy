<template>
  <ion-modal :is-open="isOpen" @didDismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center gradient-text">Filter</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list class="ion-padding button-list">
        <ion-button
          v-for="tag in tags"
          :key="tag.id"
          :class="{'selected': selectedTags.includes(tag.id)}"
          @click="toggleSelection('tag', tag.id)"
        >
          <span :class="{'gradient-text': selectedTags.includes(tag.id)}">
          {{ tag.name }}
        </span>
        </ion-button>
        <ion-button
          v-for="trigger in triggers"
          :key="trigger.id"
          :class="{'selected': selectedTriggers.includes(trigger.id)}"
          @click="toggleSelection('trigger', trigger.id)"
        >
          <span :class="{'gradient-text': selectedTriggers.includes(trigger.id)}">
          {{ trigger.name }}
        </span>
        </ion-button>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonList, IonItem, IonLabel, IonChip, IonIcon } from '@ionic/vue';
import { checkmarkCircle, ellipseOutline, closeOutline } from 'ionicons/icons';
import { useTagStore } from '@/stores/tag';
import { useTriggerStore } from '@/stores/trigger';

export default defineComponent({
  name: 'PostFilterModal',
  components: {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonChip,
    IonIcon
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      selectedTags: [] as number[],
      selectedTriggers: [] as number[]
    };
  },
  computed: {
    tags() {
      return useTagStore().tags;
    },
    triggers() {
      return useTriggerStore().triggers;
    }
  },
  setup() {
    useTagStore().fetchAllTags();
    useTriggerStore().fetchAllTriggers();
    return { checkmarkCircle, ellipseOutline, closeOutline };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    toggleSelection(type: 'tag' | 'trigger', id: number) {
      if (type === 'tag') {
        if (this.selectedTags.includes(id)) {
          this.selectedTags = this.selectedTags.filter(tagId => tagId !== id);
        } else {
          this.selectedTags.push(id);
        }
      } else if (type === 'trigger') {
        if (this.selectedTriggers.includes(id)) {
          this.selectedTriggers = this.selectedTriggers.filter(triggerId => triggerId !== id);
        } else {
          this.selectedTriggers.push(id);
        }
      }
      this.$emit('update:selectedTags', this.selectedTags);
      this.$emit('update:selectedTriggers', this.selectedTriggers);
    }
  }
});
</script>