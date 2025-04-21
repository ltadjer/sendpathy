<template>
  <ion-modal :is-open="isOpen" @ionModalDidDismiss="closeModal">
    <ion-header :translucent="true" class="ion-padding">
      <ion-toolbar>
        <ion-title>{{ modalTitle }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">
            <ion-icon :icon="closeOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-segment v-model="selectedSegment" class="ion-padding">
        <ion-segment-button value="followers" :class="{'ion-shadow-in': selectedSegment === 'followers'}">
          <ion-label><span :class="{'gradient-text': selectedSegment === 'followers'}">Confidents</span></ion-label>
        </ion-segment-button>
        <ion-segment-button value="followings" :class="{'ion-shadow-in': selectedSegment === 'followings'}">
          <ion-label><span :class="{'gradient-text': selectedSegment === 'followings'}">Confidences</span></ion-label>
        </ion-segment-button>
      </ion-segment>
      <ion-list class="ion-padding">
        <ion-item lines="none" v-for="user in filteredUsers" :key="user.id" @click="showUserProfile(user)">
          <div class="avatar-container ion-no-margin ion-margin-end">
            <ion-avatar slot="start">
              <img :src="user.avatar" alt="User Avatar" />
            </ion-avatar>
          </div>
          <ion-label>{{ user.username }}</ion-label>
          <ion-icon v-if="isCurrentUser" class="custom-icon" :icon="trashOutline" slot="end" @click.stop="removeUser(user.id)" />
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonList, IonItem, IonAvatar, IonLabel, IonSegment, IonSegmentButton } from '@ionic/vue';
import { closeOutline, trashOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'ProfileFriendshipsModal',
  components: { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonList, IonItem, IonAvatar, IonLabel, IonSegment, IonSegmentButton },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    followers: {
      type: Array as PropType<Array<{ id: string; avatar: string; username: string }>>,
      required: true
    },
    followings: {
      type: Array as PropType<Array<{ id: string; avatar: string; username: string }>>,
      required: true
    },
    initialSegment: {
      type: String as PropType<'followers' | 'followings'>,
      required: true
    },
    isCurrentUser: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      selectedSegment: this.initialSegment,
    };
  },
  computed: {
    filteredUsers() {
      return this.selectedSegment === 'followers' ? this.followers : this.followings;
    },
    modalTitle() {
      return this.selectedSegment === 'followers' ? 'Followers' : 'Followings';
    }
  },
  setup() {
    const router = useRouter();
    return { trashOutline, closeOutline, router };
  },
  watch: {
    initialSegment(newVal) {
      this.selectedSegment = newVal;
    }
  },
  methods: {
    removeUser(userId: string) {
      this.$emit('remove', { userId, type: this.selectedSegment });
    },
    closeModal() {
      this.$emit('close');
    },
    showUserProfile(user) {
      this.closeModal();
      this.router.push({ name: 'UserProfile', params: { userId: user.id } });
    }
  }
});
</script>
<style scoped>
ion-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>