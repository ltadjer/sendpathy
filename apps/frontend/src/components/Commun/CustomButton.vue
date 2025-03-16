<template>
  <ion-button :class="buttonClass" @click.stop="handleClick">
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
      type: [String, Object],
      default: null
    },
    buttonClass: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick(event: Event) {
      event.stopPropagation();
      this.$emit('button-click', event);
    }
  }
});
</script>

<style scoped>
.gradient-text {
  background: none;
  color: #555555;
  font-weight: normal;
  -webkit-background-clip: text;
  -webkit-text-fill-color: inherit;
  transition: background 0.3s ease, -webkit-text-fill-color 0.3s ease;
}

ion-button:hover .gradient-text,
ion-button:active .gradient-text,
ion-button:focus .gradient-text {
  background: linear-gradient(-119.774deg, rgba(151, 71, 255, 60%) 0%, #FD7DFB 82%);
  -webkit-background-clip: text;
  color: transparent;
  font-weight: bold;
}

/* Ajout de l'effet gradient pour le bouton actif dans le menu */
ion-button.ion-shadow-in .gradient-text {
  background: linear-gradient(-119.774deg, rgba(151, 71, 255, 60%) 0%, #FD7DFB 82%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}

ion-button {
  border-radius: 1rem;
}
</style>
