<template>
  <ion-modal
    :is-open="isOpen"
    @did-dismiss="closeModal"
    :initial-breakpoint="0.75"
    :breakpoints="[0, 0.5, 0.75]"
    handle-behavior="cycle"
  >
    <ion-content>
      <ion-grid>
        <ion-row class="ion-margin-bottom" v-if="tags && tags.length > 0">
          <ion-col>
            <ion-select multiple v-model="localSelectedTags" placeholder="Tags" interface="popover" @ionChange="updateTags">
              <ion-select-option v-for="tag in tags" :key="tag.id" :value="tag.id">{{ tag.name }}</ion-select-option>
            </ion-select>
          </ion-col>
        </ion-row>
        <ion-row v-if="triggers && triggers.length > 0">
          <ion-col>
            <ion-select multiple v-model="localSelectedTriggers" placeholder="Triggers" interface="popover" @ionChange="updateTriggers">
              <ion-select-option v-for="trigger in triggers" :key="trigger.id" :value="trigger.id">{{ trigger.name }}</ion-select-option>
            </ion-select>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonGrid, IonRow, IonCol } from '@ionic/vue';
import { useTagStore } from '@/stores/tag';
import { useTriggerStore } from '@/stores/trigger';
import CustomButton from '@/components/Commun/CustomButton.vue'

export default defineComponent({
  name: 'PostSettingsModal',
  components: {
    CustomButton,
    IonGrid, IonRow, IonCol,
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
    isOpen: {
      type: Boolean,
      required: true,
    },
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
      localSelectedTags: [],
      localSelectedTriggers: []
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
  methods: {
    closeModal() {
      this.$emit('update:isOpen', false);
    },
    updateTags() {
      this.$emit('update:selectedTags', this.localSelectedTags);
    },
    updateTriggers() {
      this.$emit('update:selectedTriggers', this.localSelectedTriggers);
    }
  },
  async mounted() {
    console.log(this.selectedTriggers);
    await useTagStore().fetchAllTags();
    await useTriggerStore().fetchAllTriggers();
    this.localSelectedTags = this.selectedTags.map(tag => tag.id);
    this.localSelectedTriggers = this.selectedTriggers.map(trigger => trigger.id);
  }
});
</script>
