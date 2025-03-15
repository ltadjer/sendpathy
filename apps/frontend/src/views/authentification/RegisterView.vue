<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :defaultHref="true" :icon="arrowBackOutline" @click="navigateToLogin" />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-grid class="flex-center">
        <ion-row>
          <ion-col class="ion-text-center">
            <img alt="Logo" src="/img/logo-with-shadow.svg" width="120px" />
            <ion-text>
              <h1 class="gradient-text ion-input-spacing">Hâte de te connaître !</h1>
            </ion-text>
            <form @submit.prevent="register" class="ion-text-left form-container">
              <ion-button expand="block" color="primary" @click="generateAvatars">Générer un avatar</ion-button>
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

              <ion-input
                class="ion-input-spacing"
                placeholder="Email"
                type="email"
                v-model="email"
                required
              ></ion-input>
              <ion-input
                class="ion-input-spacing"
                placeholder="Pseudo"
                type="text"
                v-model="username"
                required
              ></ion-input>
              <ion-select
                class="ion-input-spacing"
                interface="popover"
                placeholder="Langue maternelle"
                v-model="nativeLanguage"
                required
              >
                <ion-select-option v-for="language in languages" :key="language" :value="language">
                  {{ language }}
                </ion-select-option>
              </ion-select>
              <ion-select
                class="ion-input-spacing"
                interface="popover"
                placeholder="Année de naissance"
                v-model="yearOfBirth"
                required
              >
                <ion-select-option v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </ion-select-option>
              </ion-select>
              <ion-input
                class="ion-input-spacing"
                placeholder="Mot de passe"
                type="password"
                v-model="password"
                required>
                <ion-input-password-toggle slot="end"></ion-input-password-toggle>
              </ion-input>
              <custom-button expand="block" color="primary" type="submit" text="S'inscrire"></custom-button>
            </form>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ToastMessage/>
    </ion-content>
  </ion-page>
</template>
<script>
import { defineComponent } from 'vue';
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonInput,
  IonList,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonInputPasswordToggle,
  IonHeader,
  IonToolbar,
IonBackButton,
  IonButtons
} from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import CustomButton from '@/components/Commun/CustomButton.vue';
import ToastMessage from '@/components/Commun/ToastMessage.vue';
import { useAccountStore } from '@/stores/account';


export default defineComponent({
  name: 'RegisterView',
  components: {
    ToastMessage,
    CustomButton,
    IonContent,
    IonPage,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonInput,
    IonList,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonInputPasswordToggle,
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonButtons
  },
  data() {
    return {
      email: '',
      username: '',
      password: '',
      nativeLanguage: '',
      yearOfBirth: null,
      selectedAvatar: '', // Avatar sélectionné
      avatars: [], // Liste des avatars générés
      years: [],
      languages: [
        'Anglais',
        'Français',
        'Espagnol',
        'Allemand',
        'Chinois',
        'Japonais',
        'Coréen',
        'Russe',
        'Portugais',
        'Italien',
      ],
    };
  },
  created() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 18;
    for (let year = startYear; year >= startYear - 82; year--) {
      this.years.push(year);
    }
  },
  setup() {
    return { arrowBackOutline };
  },
  methods: {
    // Générer plusieurs avatars
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
    // Sélectionner un avatar
    selectAvatar(avatar) {
      this.selectedAvatar = avatar;
    },
    async register() {
      try {
        const age = new Date().getFullYear() - this.yearOfBirth;
        if (age < 18) {
          alert('Vous devez avoir au moins 18 ans pour vous inscrire.');
          return;
        }

        const user = {
          email: this.email,
          username: this.username,
          password: this.password,
          nativeLanguage: this.nativeLanguage,
          age: age,
          avatar: this.selectedAvatar,
        };

        await useAccountStore().register(user);
      } catch (error) {
        console.error("Échec de l'inscription :", error);
      }
    },
    navigateToLogin() {
      this.$router.push('/connexion');
    }
  },
});
</script>
