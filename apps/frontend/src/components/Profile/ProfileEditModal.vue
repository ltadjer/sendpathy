<template>
  <ion-modal :is-open="isOpen" @ionModalDidDismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center gradient-text">Modifier le profil</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">
            <ion-icon :icon="closeOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list class="ion-padding">
        <ion-grid>
          <ion-row>
            <ion-col class="center">
              <ion-item lines="none" class="ion-align-items-center ion-justify-content-center ion-no-shadow">
                <div class="avatar-container">
                  <ion-avatar slot="start" class="large-avatar">
                    <img :src="selectedAvatar" alt="Avatar actuel" class="current-avatar" />
                  </ion-avatar>
                </div>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-button expand="block" @click="generateAvatars" class="ion-margin-bottom">Changer d'avatar</ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>

        <ion-item lines="none" class="ion-no-shadow">
          <div class="avatar-selection">
            <div v-for="(avatar, index) in avatars" :key="index" class="avatar-container"
                 :class="{ 'selected': avatar === selectedAvatar }"
                 @click="selectAvatar(avatar)">
              <img
                :src="avatar"
                alt="Avatar proposé"
                class="avatar-option"
              />
            </div>
          </div>
        </ion-item>
        <ion-item lines="none" class="ion-no-shadow">
          <ion-input label="Pseudo" class="ion-input-spacing" v-model="username" placeholder="Pseudo"/>
        </ion-item>
        <ion-item lines="none" class="ion-no-shadow">
          <ion-input label="Âge" class="ion-input-spacing" v-model="age" placeholder="Âge" type="number"/>
        </ion-item>
        <ion-item lines="none" class="ion-no-shadow">
          <ion-textarea
            label="Biographie"
            class="ion-input-spacing"
            placeholder="Type something here"
            :auto-grow="true"
            v-model="biography"
            rows="3"
          >
          </ion-textarea>
        </ion-item>
        <custom-button expand="block" color="primary" type="submit" text="Enregistrer" @click="saveChanges()"></custom-button>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonItem, IonLabel, IonInput, IonTextarea, IonList, IonGrid, IonRow, IonCol, IonAvatar } from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';
import CustomButton from '@/components/Commun/CustomButton.vue';
import { useAccountStore } from '@/stores/account';

export default defineComponent({
  name: 'ProfileEditModal',
  components: { IonList, IonGrid, IonRow, IonCol, IonAvatar, IonTextarea, CustomButton, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonItem, IonLabel, IonInput },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    currentUser: {
      type: Object as PropType<{ username: string; biography: string; avatar: string; age: number }>,
      required: true
    }
  },
  data() {
    return {
      username: this.currentUser.username,
      biography: this.currentUser.biography,
      selectedAvatar: this.currentUser.avatar,
      age: this.currentUser.age,
      avatars: []
    };
  },
  setup() {
    return { closeOutline };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async saveChanges() {
      const updatedUser = {
        username: this.username,
        biography: this.biography,
        avatar: this.selectedAvatar,
        age: parseInt(this.age)
      };
      await useAccountStore().updateUser(updatedUser);
      this.$emit('save', updatedUser);
      this.closeModal();
    },
    generateAvatars() {
      const newAvatars = [];
      const backgroundColors = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'];
      for (let i = 0; i < 6; i++) {
        const seed = `${this.username}-${Math.random().toString(36).substr(2, 9)}`;
        const backgroundColor = backgroundColors[i % backgroundColors.length];
        newAvatars.push(`https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&backgroundColor=${backgroundColor}`);
      }
      this.avatars = newAvatars;
    },
    selectAvatar(avatar) {
      this.selectedAvatar = avatar;
    }
  }
});
</script>

<style scoped>
ion-textarea {
  box-shadow: var(--neumorphism-in-shadow);
  border-radius: 1rem;
  padding-left: 1rem;
}

ion-item {
  --inner-padding-end: 0;
}

.large-avatar {
  width: 100px;
  height: 100px;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-container {
  padding: 0.4rem;
  margin: 2rem;
}

ion-grid {
  margin-top: 0 !important;
}
</style>