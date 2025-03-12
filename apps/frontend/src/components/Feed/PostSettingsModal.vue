<template>
  <ion-modal
    :is-open="isOpen"
    @did-dismiss="closeModal"
    :initial-breakpoint="isMobile ? 0.75 : undefined"
    :breakpoints="isMobile ? [0, 0.5, 0.75] : undefined"
    handle-behavior="cycle"
  >
    <ion-header v-if="isDesktop">
      <ion-toolbar>
        <ion-title class="ion-text-center gradient-text">Catégories du post</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-grid>
        <ion-row class="ion-margin-bottom" v-if="tags && tags.length > 0">
          <ion-col>
            <ion-text class="ion-margin-bottom">Tags</ion-text>
            <ion-list class="button-list">
              <ion-button
                v-for="tag in tags"
                :key="tag.id"
                :class="{'selected': Array.from(localSelectedTags).includes(tag.id)}"
                @click="toggleSelection('tag', tag.id)"
                expand="block"
                color="primary"
              >
          <span :class="{'gradient-text': Array.from(localSelectedTags).includes(tag.id)}">
              {{ tag.name }}
            </span>
              </ion-button>
            </ion-list>
          </ion-col>
        </ion-row>

        <ion-row v-if="triggers && triggers.length > 0">
          <ion-col>
            <ion-text class="ion-margin-bottom">Triggers</ion-text>
            <ion-list class="button-list">
              <ion-button
                v-for="trigger in triggers"
                :key="trigger.id"
                :class="{'selected gradient-text': localSelectedTriggers.includes(trigger.id)}"
                @click="toggleSelection('trigger', trigger.id)"
                expand="block"
                color="primary"
              >
                <span :class="{'gradient-text': localSelectedTriggers.includes(trigger.id)}">
                {{ trigger.name }}
              </span>
              </ion-button>
            </ion-list>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-modal>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonList, IonText } from '@ionic/vue';
import { useTagStore } from '@/stores/tag';
import { useTriggerStore } from '@/stores/trigger';
import { closeOutline } from 'ionicons/icons';
import CustomButton from '@/components/Commun/CustomButton.vue';
import { usePostStore } from '@/stores/post';

export default defineComponent({
  name: 'PostSettingsModal',
  components: {
    CustomButton,
    IonIcon,
    IonGrid, IonRow, IonCol, IonModal, IonHeader, IonToolbar, IonTitle,
    IonButtons, IonButton, IonContent, IonList, IonText
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
    },
    postId: {
      type: String
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
    },
    isDesktop() {
      return window.innerWidth >= 768;
    },
    isMobile() {
      return window.innerWidth < 768;
    }
  },
  setup() {
    return { closeOutline };
  },
  methods: {
    closeModal() {
      this.$emit('update:isOpen', false);
    },
    async toggleSelection(type: 'tag' | 'trigger', id: number) {
      if (type === 'tag') {
        if (this.localSelectedTags.includes(id)) {
          this.localSelectedTags = this.localSelectedTags.filter(tagId => tagId !== id);
          if (this.postId) {
            await usePostStore().removeTagFromPost(this.postId, id);
          }
        } else {
          this.localSelectedTags.push(id);
          if (this.postId) {
            await usePostStore().addTagToPost(this.postId, id);
          }
        }
        this.updateTags();
      } else if (type === 'trigger') {
        if (this.localSelectedTriggers.includes(id)) {
          this.localSelectedTriggers = this.localSelectedTriggers.filter(triggerId => triggerId !== id);
          if (this.postId) {
            await usePostStore().removeTriggerFromPost(this.postId, id);
          }
        } else {
          this.localSelectedTriggers.push(id);
          if (this.postId) {
            await usePostStore().addTriggerToPost(this.postId, id);
          }
        }
        this.updateTriggers();
      }
    },
    updateTags() {
      this.$emit('update:selectedTags', this.localSelectedTags);
    },
    updateTriggers() {
      this.$emit('update:selectedTriggers', this.localSelectedTriggers);
    }
  },
  async mounted() {
    await useTagStore().fetchAllTags();
    await useTriggerStore().fetchAllTriggers();
    this.localSelectedTags = this.selectedTags.map(tag => tag.id);
    this.localSelectedTriggers = this.selectedTriggers.map(trigger => trigger.id);
  }
});
</script>

<style scoped>
ion-content {
  --padding-start: 1rem;
  --padding-end: 1rem;
}
</style>
