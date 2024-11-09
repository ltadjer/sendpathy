<template>
  <ion-item>
    <ion-grid>
      <ion-row>
        <ion-col>
          <ion-item>
            <p><span>{{comment.user.username}}</span> : {{ comment.content }}</p>
            <ion-button slot="end" @click="deleteComment">Delete</ion-button>
            <ion-button slot="end" @click="toggleReplies">
              {{ comment.showReplies ? 'Hide Replies' : 'Show Replies' }}
            </ion-button>
            <ion-button slot="end" @click="toggleLike">
              <ion-icon :icon="comment.isLiked ? heart : heartOutline"></ion-icon>
              <span v-if="comment.likes">{{ comment.likes.length }}</span>
            </ion-button>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-item>
            <ion-input v-model="replyContent" placeholder="Add a reply..."></ion-input>
            <ion-button @click="addReply">Reply</ion-button>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row v-if="comment.showReplies">
        <ion-col>
          <ion-list>
            <comment-item
              v-for="reply in comment.replies"
              :key="reply.id"
              :comment="reply"
              :post-id="postId"
              @update-comments="$emit('update-comments')"
            ></comment-item>
          </ion-list>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonItem, IonButton, IonInput, IonList, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/vue';
import commentService from '@/services/comment.service';
import likeService from '@/services/like.service';
import { heart, heartOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'CommentItem',
  components: {
    IonItem,
    IonButton,
    IonInput,
    IonList,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon
  },
  props: {
    comment: Object,
    postId: String
  },
  data() {
    return {
      replyContent: '',
      heart,
      heartOutline
    };
  },
  methods: {
    async deleteComment() {
      await commentService.deleteCommentFromPost(this.postId, this.comment.id);
      await this.$emit('update-comments');
    },
    async addReply() {
      await commentService.addCommentToComment(this.comment.id, { content: this.replyContent });
      this.replyContent = '';
      await this.$emit('update-comments');
    },
    toggleReplies() {
      this.comment.showReplies = !this.comment.showReplies;
    },
    async toggleLike() {
      if (this.comment.isLiked) {
        await likeService.unlikeComment(this.comment.id);
        this.comment.isLiked = false;
      } else {
        await likeService.likeComment(this.comment.id);
        this.comment.isLiked = true;
      }
      await this.$emit('update-comments');
    }
  },
  created() {
    this.comment.showReplies = false;
  }
});
</script>