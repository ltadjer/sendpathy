<template>
  <ion-grid>
    <ion-row>
      <ion-col class="comment-container">
        <ion-item lines="none" class="full-width ion-align-items-start">
          <div class="avatar-container">
            <ion-avatar>
              <img alt="User Avatar" :src="comment.user.avatar" />
            </ion-avatar>
          </div>
          <div class="comment-content">
            <div class="comment-header">
              <span class="username">{{ comment.user.username }}</span>
              <span>
              <ion-icon
                class="icon-size"
                @click="toggleLike(comment)"
                :icon="comment.isLiked ? heart : heartOutline"
              ></ion-icon>
              <span v-if="comment.likes" class="likes-count">{{ comment.likes.length }}</span>
            </span>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
            <div class="comment-actions">
              <ion-text v-if="comment.replies && comment.replies.length > 0" @click="toggleReplies(comment)">
                {{ comment.showReplies ? 'Masquer les réponses' : 'Afficher les réponses' }}
              </ion-text>
              <ion-text @click="$emit('reply', comment)" class="reply-text">Répondre</ion-text>
              <ion-text v-if="comment.user.id === currentUser.id" @click="deleteComment(comment)" class="delete-text">Supprimer</ion-text>
            </div>
            <!-- Replies section -->
            <div v-if="comment.showReplies && comment.replies && comment.replies.length > 0" class="replies">
              <comment-item
                v-for="reply in comment.replies"
                :key="reply.id"
                :comment="reply"
                :post-id="postId"
                :current-user="currentUser"
                @reply="$emit('reply', reply)"
              ></comment-item>
            </div>
          </div>
        </ion-item>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonThumbnail,
  IonText,
  IonIcon,
  IonAvatar,
  IonItem,
} from '@ionic/vue';
import { heart, heartOutline } from 'ionicons/icons';
import { usePostStore } from '@/stores/post';

export default defineComponent({
  name: 'CommentItem',
  components: {
    IonAvatar,
    IonGrid,
    IonRow,
    IonCol,
    IonThumbnail,
    IonText,
    IonIcon,
    IonItem,
  },
  props: {
    comment: {
      type: Object,
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
      heart,
      heartOutline,
      defaultAvatar: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
    };
  },
  methods: {
    toggleReplies(comment) {
      comment.showReplies = !comment.showReplies;
    },
    async deleteComment(comment) {
      if (comment.parentId) {
        await usePostStore().deleteCommentFromComment(comment.parentId, comment.id);
      } else {
        await usePostStore().deleteCommentFromPost(this.postId, comment.id);
      }
    },
    async toggleLike(comment) {
      if (comment.isLiked) {
        await usePostStore().unlikeComment(comment.id);
        comment.isLiked = false;
      } else {
        await usePostStore().likeComment(comment.id);
        comment.isLiked = true;
      }
    },
  },
  created() {
    this.comment.showReplies = false;
  },
});
</script>

<style scoped>
.comment-container {
  display: flex;
  align-items: flex-start;
}

.comment-content {
  flex: 1;
  padding: 12px;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

ion-item::part(native) {
  padding-right: 0 !important;
  padding-left: 0 !important;
  --inner-padding-end: none !important;
  --inner-padding-start: none !important;
}
.username {
  font-weight: bold;
  margin-right: 10px;
}

.comment-text {
  margin: 5px 0;
}

.comment-actions {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: gray;
}

.icon-size {
  font-size: 20px;
  cursor: pointer;
}
ion-grid {
  margin-top: 1rem !important;
}

.avatar-container {
  margin: 0.5rem !important;
}
ion-avatar {
  width: 40px;
  height: 40px;
}

</style>