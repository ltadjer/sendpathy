<template>
  <ion-button :class="buttonClass" @click="handleClick">
    <span v-if="text" class="gradient-text">{{ text }}</span>
    <ion-icon v-if="icon" :icon="icon"></ion-icon>
  </ion-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonButton, IonIcon } from '@ionic/vue';

export default defineComponent({
  name: 'CustomButton',
  components: {
    IonButton,
    IonIcon
  },
  props: {
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: Object,
      default: null
    },
    buttonClass: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick(event: Event) {
      this.$emit('click', event);
    }
  }
});
</script>
