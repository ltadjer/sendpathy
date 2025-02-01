<template>
  <ion-modal
    :is-open="true"
    @didDismiss="closeModal"
    :initial-breakpoint="1"
    :breakpoints="[0,1]"
    handle-behavior="cycle"
    class="custom-modal"
  >
    <ion-content>
      <ion-grid v-if="comments && comments.length > 0">
        <ion-row v-for="comment in comments" :key="comment.id">
          <comment-item
            :key="comment.id"
            :comment="comment"
            :post-id="postId"
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
    </ion-content>

    <!-- Add a comment or reply -->
    <ion-footer class="add-comment-fixed">
      <ion-grid>
        <!-- Input pour commenter ou répondre -->
        <ion-row class="add-comment">
          <ion-col size="10">
            <ion-grid>
              <ion-row>
                <ion-col>
                  <ion-avatar>
                    <img :src="currentUser.avatar" :alt="currentUser.username">
                  </ion-avatar>
                </ion-col>
                <ion-col>
                  <ion-input
                    type="text"
                    v-model="newComment"
                    :placeholder="replyTarget ? `Répondre à @${replyTarget.user.username}` : 'Ajouter un commentaire...'"
                  ></ion-input>
                </ion-col>
              </ion-row>
            </ion-grid>

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
import { defineComponent } from 'vue';
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
    CommentItem,
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
      isSubmitting: false, // Ajout d'un flag
    };
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
}

ion-input {
  margin:  0 !important;
}

ion-item {
  --padding-start: 0px;
  --inner-padding-end: 0px;
  --background: none !important;
}

ion-footer ion-grid {
  margin: 0 !important;
}

.add-comment {
  align-items: center;
  justify-content: center;
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

ion-avatar {
  box-shadow: var(--neumorphism-in-shadow);
  width: 51px;
  height: 51px;
}

</style>