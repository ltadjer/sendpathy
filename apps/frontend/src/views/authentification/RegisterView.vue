<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-grid class="flex-center">
        <ion-row>
          <ion-col class="ion-text-center">
            <img alt="Logo" src="/img/logo-with-shadow.svg" width="120px"/>
            <ion-text>
              <h1 class="gradient-text ion-input-spacing">Hâte de te connaître ! </h1>
            </ion-text>
            <form @submit.prevent="register" class="ion-text-left form-container">
              <ion-input class="ion-input-spacing" placeholder="Email" type="email" v-model="email" required></ion-input>
              <ion-input class="ion-input-spacing" placeholder="Pseudo" type="pseudo" v-model="username" required></ion-input>
              <ion-select class="ion-input-spacing ion-input-spacing" interface="popover" placeholder="Langue maternelle" v-model="nativeLanguage" required>
                <ion-select-option v-for="language in languages" :key="language" :value="language">{{ language }}</ion-select-option>
              </ion-select>
              <ion-select class="ion-input-spacing ion-input-spacing" interface="popover" placeholder="Année de naissance" v-model="yearOfBirth" required>
                <ion-select-option v-for="year in years" :key="year" :value="year">{{ year }}</ion-select-option>
              </ion-select>
              <ion-input class="ion-input-spacing" placeholder="Mot de passe" type="password" v-model="password" required></ion-input>
              <custom-button expand="block" color="primary" type="submit" text="S'inscrire"></custom-button>
            </form>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
import AuthService from '../../services/auth.service.ts';
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonText, IonInput, IonList, IonSelect, IonSelectOption } from '@ionic/vue';
import CustomButton from '@/components/Commun/CustomButton.vue'

export default defineComponent({
  name: 'RegisterView',
  components: {
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
    IonSelectOption
  },
  data() {
    return {
      email: '',
      username: '',
      password: '',
      nativeLanguage: '',
      yearOfBirth: null,
      years: [],
      languages: ['Anglais', 'Français', 'Espagnol', 'Allemand', 'Chinois', 'Japonais', 'Coréen', 'Russe', 'Portugais', 'Italien']
    };
  },
  created() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 18;
    for (let year = startYear; year >= startYear - 82; year--) {
      this.years.push(year);
    }
  },
  methods: {
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
          age: age
        };
        const response = await AuthService.register(user);
        console.log('Inscription réussie :', response);
      } catch (error) {
        console.error('Échec de l\'inscription :', error);
      }
    }
  }
});
</script>
