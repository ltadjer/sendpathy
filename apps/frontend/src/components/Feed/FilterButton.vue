<template v-if="tags.length > 0 && triggers.length > 0">
  <div>
    <ion-button @click="openPopover" id="filter-button">
      <ion-icon :icon="filterOutline"></ion-icon>
    </ion-button>
    <ion-popover :is-open="isPopoverOpen" trigger="filter-button" side="bottom" alignment="end">
      <ion-content>
        <ion-list>
          <ion-item lines="none" v-for="tag in tags" :key="tag.id" @click="toggleSelection('tag', tag.id)">
            <ion-label>{{ tag.name }}</ion-label>
            <ion-checkbox slot="end" :checked="selectedTags.includes(tag.id)"></ion-checkbox>
          </ion-item>
          <ion-item lines="none" v-for="trigger in triggers" :key="trigger.id" @click="toggleSelection('trigger', trigger.id)">
            <ion-label>{{ trigger.name }}</ion-label>
            <ion-checkbox slot="end" :checked="selectedTriggers.includes(trigger.id)"></ion-checkbox>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-popover>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonButton, IonIcon, IonPopover, IonContent, IonList, IonItem, IonLabel, IonCheckbox } from '@ionic/vue';
import { filterOutline } from 'ionicons/icons';
import { useTagStore } from '@/stores/tag';
import { useTriggerStore } from '@/stores/trigger';

export default defineComponent({
  name: 'FilterButton',
  components: {
    IonButton,
    IonIcon,
    IonPopover,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox
  },
  data() {
    return {
      isPopoverOpen: false,
      selectedTags: [] as number[],
      selectedTriggers: [] as number[],
    };
  },
  computed: {
    tags() {
      return useTagStore().tags;
    },
    triggers() {
      return useTriggerStore().triggers;
    },
  },
  setup() {
    useTagStore().fetchAllTags();
    useTriggerStore().fetchAllTriggers();
    return { filterOutline };
  },
  methods: {
    openPopover() {
      this.isPopoverOpen = true;
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
    }
  }
});
</script>

<style scoped>
/* Add any custom styles here */
</style>