<template>
  <div>
    <h2>Inscription</h2>
    <form @submit.prevent="register">
      <div>
        <label>Email :</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label>Pseudo :</label>
        <input type="text" v-model="username" required />
      </div>
      <div>
        <label>Mot de passe :</label>
        <input type="password" v-model="password" required />
      </div>
      <div>
        <label>Langue maternelle :</label>
        <select v-model="nativeLanguage" required>
          <option v-for="language in languages" :key="language" :value="language">{{ language }}</option>
        </select>
      </div>
      <div>
        <label>Année de naissance :</label>
        <select v-model="yearOfBirth" required>
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
      <button type="submit">S'inscrire</button>
    </form>
  </div>
</template>

<script>
import AuthService from '../services/auth.service';

export default {
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
};
</script>