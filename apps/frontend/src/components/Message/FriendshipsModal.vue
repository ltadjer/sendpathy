<template>
  <ion-modal :is-open="isOpen" @ionModalDidDismiss="closeModal">
    <ion-header :translucent="true" class="ion-padding">
      <ion-toolbar>
        <ion-title>Créer une bulle à deux</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">
            <ion-icon :icon="closeOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-searchbar
        v-if="friendsList.length > 0"
        class="ion-padding"
        v-model="searchTerm"
        placeholder="Rechercher"
      ></ion-searchbar>
      <ion-list v-if="friendsList.length > 0" class="ion-padding">
        <ion-item
          lines="none"
          v-for="friend in filteredFriends"
          :key="friend.id"
          @click="selectFriend(friend)"
        >
          <div class="avatar-container ion-no-margin ion-margin-end">
            <ion-avatar slot="start">
              <img :src="friend.avatar" alt="User Avatar" />
            </ion-avatar>
          </div>
          <ion-label>{{ friend.username }}</ion-label>
        </ion-item>
      </ion-list>
      <div v-else class="ion-padding no-friends-message">
        <p>Aucun connexion mutuelle pour l'instant.</p>
      </div>
    </ion-content>
  </ion-modal>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonList, IonItem, IonAvatar, IonLabel, IonSearchbar } from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'FriendshipsModal',
  components: { IonSearchbar, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonList, IonItem, IonAvatar, IonLabel },
  props: {
    isOpen: { type: Boolean, required: true },
    friendsList: { type: Array as PropType<Array<{ id: string; avatar: string; username: string }>>, required: true },
  },
  data() {
    return {
      searchTerm: '',
    };
  },
  computed: {
    filteredFriends() {
      return this.friendsList.filter(friend =>
        friend.username.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
  },
  emits: ['close', 'select'],
  setup() {
    return { closeOutline };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    selectFriend(friend: { id: string; avatar: string; username: string }) {
      this.$emit('select', friend);
    },
  },
});
</script>
