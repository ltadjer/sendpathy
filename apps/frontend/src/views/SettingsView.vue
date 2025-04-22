<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-padding header-page">
      <ion-toolbar class="ion-no-shadow">
        <ion-buttons slot="start">
          <ion-back-button :defaultHref="true" :icon="arrowBackOutline" />
        </ion-buttons>
        <ion-title>Paramètres</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list class="ion-padding">
        <!-- Public Information -->
        <ion-item-group>
          <ion-item-divider>
            <ion-label> <span class="gradient-text">Informations publics</span></ion-label>
          </ion-item-divider>
          <ion-item lines="none">
            <ion-label>Pseudo</ion-label>
            <ion-icon :icon="pencilOutline" slot="end" @click="editField('username')"></ion-icon>
            <ion-input v-if="editingField === 'username'" v-model="currentUser.username" @focusout="saveField('username')"></ion-input>
            <ion-label v-else>{{ currentUser.username }}</ion-label>
          </ion-item>
        </ion-item-group>

        <!-- Private Information -->
        <ion-item-group>
          <ion-item-divider>
            <ion-label> <span class="gradient-text">Private Information</span></ion-label>
          </ion-item-divider>
          <ion-item lines="none">
            <ion-label>Email</ion-label>
            <ion-icon :icon="pencilOutline" slot="end" @click="editField('email')"></ion-icon>
            <ion-input v-if="editingField === 'email'" v-model="currentUser.email" @focusout="saveField('email')"></ion-input>
            <ion-label v-else>{{ currentUser.email }}</ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-label>Âge</ion-label>
            <ion-icon :icon="pencilOutline" slot="end" @click="editField('age')"></ion-icon>
            <ion-input v-if="editingField === 'age'" v-model="currentUser.age" @focusout="saveField('age')" placeholder="Âge" type="number"/>
            <ion-label v-else>{{ currentUser.age }}</ion-label>
          </ion-item>
        </ion-item-group>

        <ion-item-group>
          <ion-item-divider>
            <ion-label> <span class="gradient-text">Code d'accès du journal</span></ion-label>
          </ion-item-divider>
          <ion-item lines="none">
            <ion-label>Code d'accès</ion-label>
            <ion-icon :icon="pencilOutline" slot="end" @click="editField('accessCode')"></ion-icon>
            <ion-input
              v-if="editingField === 'accessCode'"
              v-model="accessCode"
              type="password"
              @focusout="saveAccessCode"
            ></ion-input>
            <ion-label v-else>********</ion-label>
          </ion-item>
        </ion-item-group>

        <!-- Preferences -->
        <ion-item-group>
          <ion-item-divider>
            <ion-label> <span class="gradient-text">Préférences</span></ion-label>
          </ion-item-divider>
          <ion-item lines="none">
            <ion-label>Language</ion-label>
            <ion-select v-model="currentUser.nativeLanguage" interface="popover">
              <ion-select-option v-for="language in languages" :key="language" :value="language">
                {{ language }}
              </ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item lines="none">
            <ion-label>Triggers</ion-label>
            <ion-select v-model="selectedTriggers" interface="popover" multiple="true" @ionChange="updateTriggers">
              <ion-select-option v-for="trigger in triggers" :key="trigger.id" :value="trigger.id">
                {{ trigger.name }}
              </ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item lines="none">
            <ion-label>Tags</ion-label>
            <ion-select v-model="selectedTags" interface="popover" multiple="true" @ionChange="updateTags">
              <ion-select-option v-for="tag in tags" :key="tag.id" :value="tag.id">
                {{ tag.name }}
              </ion-select-option>
            </ion-select>
          </ion-item>
        </ion-item-group>

        <!-- Notifications TODO: -->
        <ion-item-group>
          <ion-item-divider>
            <ion-label> <span class="gradient-text">Notifications </span></ion-label>
          </ion-item-divider>
          <ion-item lines="none">
            <ion-label>Posts</ion-label>
            <ion-toggle v-model="notifications.posts" slot="end"></ion-toggle>
          </ion-item>
          <ion-item lines="none">
            <ion-label>Messages privés</ion-label>
            <ion-toggle v-model="notifications.privateMessages" slot="end"></ion-toggle>
          </ion-item>
        </ion-item-group>

        <!-- Subscription and Billing TODO -->

        <ion-item-group>
          <ion-item-divider>
            <ion-label> <span class="gradient-text">Abonnement et facturation </span></ion-label>
          </ion-item-divider>
          <ion-item lines="none">
            <ion-label>Abonnement</ion-label>
            <ion-select v-model="basic" interface="popover">
              <ion-select-option value="basic">Basic</ion-select-option>
              <ion-select-option value="premium">Premium</ion-select-option>
              <ion-select-option value="vip">VIP</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item lines="none">
            <ion-label>**** **** **** 6965</ion-label>
          </ion-item>
          <ion-item lines="none">
            <custom-button text="Annuler l'abonnement"></custom-button>
          </ion-item>
        </ion-item-group>

        <!-- Account Management -->
        <ion-item-group>
          <ion-item-divider>
            <ion-label> <span class="gradient-text">Compte</span></ion-label>
          </ion-item-divider>
          <ion-item lines="none">
            <custom-button @click="deleteAccount()" text="Supprimer le compte"></custom-button>
          </ion-item>
          <ion-item lines="none">
            <custom-button text="Supprimer tous les posts"></custom-button>
          </ion-item>
        </ion-item-group>
      </ion-list>
      <ToastMessage />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { pencilOutline } from 'ionicons/icons';
import { useTagStore } from '@/stores/tag';
import { useTriggerStore } from '@/stores/trigger';
import { useAccountStore } from '@/stores/account';
import CustomButton from '@/components/Commun/CustomButton.vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonItemDivider,
  IonButton,
  IonList,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonIcon,
  IonButtons,
  IonBackButton,
  IonItemGroup,
} from '@ionic/vue';
import ToastMessage from '@/components/Commun/ToastMessage.vue'

export default defineComponent({
  name: 'SettingsView',
  components: {
    ToastMessage,
    CustomButton,
    IonButtons,
    IonBackButton,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonItemDivider,
    IonButton,
    IonList,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonToggle,
    IonIcon,
    IonItemGroup,
  },
  data() {
    return {
      accessCode: '',
      notifications: {
        posts: true,
        privateMessages: true,
      },
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
      editingField: '',
    };
  },
  setup() {
    return {
      pencilOutline,
    };
  },
  async created() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 18;
    for (let year = startYear; year >= startYear - 82; year--) {
      this.years.push(year);
    }
    await useTagStore().fetchAllTags();
    await useTriggerStore().fetchAllTriggers();
    console.log('tags',this.currentUser.tags);
  },
  computed: {
    triggers() {
      return useTriggerStore().triggers;
    },
    tags() {
      return useTagStore().tags;
    },
    currentUser() {
      return useAccountStore().user;
    },
    selectedTriggers() {
      return this.currentUser.triggers.map((trigger) => trigger.id);
    },
    selectedTags() {
      return this.currentUser.tags.map((tag) => tag.id);
    },
  },
  methods: {
    editField(field) {
      this.editingField = field;
    },
    async saveField() {
      this.editingField = '';
      const updatedUser = {
        username: this.currentUser.username,
        email: this.currentUser.email,
        age: this.currentUser.age,
        nativeLanguage: this.currentUser.nativeLanguage,
      };

      await useAccountStore().updateUser(updatedUser);
    },
    async saveAccessCode() {
      this.editingField = '';
      try {
        await useAccountStore().updateAccessCode(this.accessCode);
        console.log('Access code updated successfully');
      } catch (error) {
        console.error('Failed to update access code:', error);
      }
    },
    async updateTags(event) {
      const selectedTags = event.target.value;
      await useAccountStore().updateUserTags(this.currentUser.id, selectedTags);
    },
    async updateTriggers(event) {
      const selectedTriggers = event.target.value;
      await useAccountStore().updateUserTriggers(this.currentUser.id, selectedTriggers);
    },
    async deleteAccount() {
      await useAccountStore().deleteUser(this.currentUser.id);
    },
  },
});
</script>

<style scoped>
ion-item-divider {
  margin-top: 1rem;
  border-bottom: 1px solid #FD7DFB20;
}

ion-item-group {
  margin-top: 1rem;
  box-shadow: var(--neumorphism-out-shadow);
  border-radius: 1rem;
}

ion-item {
  box-shadow: none !important;
}

ion-input {
  margin-bottom: 0;
  margin-left: 1rem;
}

ion-select {
  margin: 0.8rem;
}

ion-item-group:nth-child(3) ion-item {
  --inner-padding-end: none !important;
}
ion-button {
  margin-bottom: 1rem;
}

ion-toggle {
  --handle-background: #f5f5fa;
  --handle-background-checked: #fd7dfb;
  --track-background: rgba(151, 71, 255, 0.3);
  --track-background-checked: rgba(253, 125, 251, 0.6);
  --handle-border-radius: 50%;
  --handle-box-shadow: var(--neumorphism-out-shadow);
}

ion-toggle::part(track) {
  border-radius: 10px;
}

ion-toggle::part(handle) {
  box-shadow: var(--neumorphism-out-shadow);
}

</style>