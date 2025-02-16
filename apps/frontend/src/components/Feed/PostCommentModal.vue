<template>
  <ion-modal
    :is-open="true"
    @didDismiss="closeModal"
    :initial-breakpoint="isMobile ? 1 : undefined"
    :breakpoints="isMobile ? [0, 1] : undefined"
    handle-behavior="cycle"
    class="custom-modal"
  >
    <ion-header v-if="isDesktop">
      <ion-toolbar>
        <ion-title class="ion-text-center gradient-text">Commentaires</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-grid v-if="comments && comments.length > 0">
        <ion-toolbar v-if="!isDesktop" class="ion-margin-top">
          <ion-title class="ion-text-center gradient-text">Commentaires</ion-title>
        </ion-toolbar>
        <ion-row v-for="comment in comments" :key="comment.id">
          <comment-item
            :key="comment.id"
            :comment="comment"
            :post-id="postId"
            :current-user="currentUser"
            @reply="setReplyTarget"
          ></comment-item>
        </ion-row>
      </ion-grid>
      <ion-grid v-else>
        <ion-row>
          <ion-col class="ion-text-center">
            <ion-text>
              <p>Aucun commentaire pour le moment</p>
            </ion-text>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Image positionnée en bas -->
      <img alt="img" src="/img/fond-sendpathy.svg" class="background-image" />
    </ion-content>

    <!-- Add a comment or reply -->
    <ion-footer class="add-comment-fixed">
      <ion-grid>
        <!-- Input pour commenter ou répondre -->
        <ion-row class="ion-align-items-center ion-justify-content-center">
          <ion-col size="10">
            <ion-item lines="none" class="ion-no-shadow">
              <div class="avatar-container ion-no-margin">
                <ion-avatar>
                  <img :src="currentUser.avatar" :alt="currentUser.username" class="avatar-option">
                </ion-avatar>
              </div>
              <ion-input
                type="text"
                v-model="newComment"
                :placeholder="replyTarget ? `Répondre à @${replyTarget.user.username}` : 'Ajouter un commentaire...'"
              ></ion-input>
            </ion-item>
          </ion-col>
          <ion-col size="2" class="ion-text-end">
            <custom-button @click="submitCommentOrReply" :icon="paperPlaneOutline"></custom-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-footer>
  </ion-modal>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue';
import {
  IonModal,
  IonContent,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonFooter,
  IonText,
  IonItem,
  IonAvatar,
  IonLabel,
  IonButton,
  IonIcon,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonButtons,
} from '@ionic/vue';

import CommentItem from './CommentItem.vue';
import { usePostStore } from '@/stores/post';
import CustomButton from '@/components/Commun/CustomButton.vue';
import { paperPlaneOutline, closeOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'PostCommentModal',
  components: {
    IonAvatar,
    IonItem,
    IonLabel,
    IonButton,
    CustomButton,
    IonModal,
    IonContent,
    IonInput,
    IonGrid,
    IonRow,
    IonCol,
    IonFooter,
    IonText,
    IonIcon,
    IonTitle,
    CommentItem,
    IonToolbar,
    IonButtons,
    IonHeader
  },
  props: {
    comments: {
      type: Array,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    currentUser: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newComment: '',
      replyTarget: null, // Gère la cible de la réponse
      defaultAvatar: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
      isSubmitting: false as boolean,
    };
  },
  computed: {
    isDesktop() {
      return window.innerWidth >= 768;
    },
    isMobile() {
      return window.innerWidth < 768;
    }
  },
  setup() {
    return { paperPlaneOutline, closeOutline };
  },
  emits: ['close'],
  methods: {
    closeModal() {
      this.$emit('close');
    },
    setReplyTarget(comment) {
      this.replyTarget = comment;
    },
    clearReplyTarget() {
      this.replyTarget = null;
    },
    async submitCommentOrReply() {
      if (this.isSubmitting || this.newComment.trim() === '') return;

      this.isSubmitting = true;
      try {
        if (this.replyTarget) {
          await usePostStore().addCommentToComment(this.replyTarget.id, {
            content: this.newComment,
          });
        } else {
          await usePostStore().addCommentToPost(this.postId, {
            content: this.newComment,
          });
        }
        this.newComment = '';
        this.replyTarget = null;
      } finally {
        this.isSubmitting = false;
      }
    },
  },
});
</script>

<style scoped>
ion-grid {
  margin-top: 1rem !important;
}
.custom-modal {
  --height: 75%;
  --border-radius: 1rem 1rem 0 0 !important;
}

@media (min-width: 1024px) {
  .custom-modal {
    --border-radius: 1rem !important;
  }
}

ion-text {
  margin-top: 2rem;
}

ion-input {
  margin:  0 !important;
}

ion-item {
  --padding-start: 0px;
  --inner-padding-end: 0px;
}

ion-footer ion-grid {
  margin: 0 !important;
}

.add-comment-fixed {
  box-shadow: var(--neumorphism-out-shadow);
  padding: 10px;
}

div {
  box-shadow: var(--neumorphism-out-shadow);
  border-radius: 50%;
  padding: 0.3rem;
  margin-right: 0.5rem;
}

.background-image {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: -1;
}
</style>
