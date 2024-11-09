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
import { IonItem, IonButton, IonInput, IonList, IonGrid, IonRow, IonCol } from '@ionic/vue';
import commentService from '@/services/comment.service';

export default defineComponent({
  name: 'CommentItem',
  components: {
    IonItem,
    IonButton,
    IonInput,
    IonList,
    IonGrid,
    IonRow,
    IonCol
  },
  props: {
    comment: Object,
    postId: String
  },
  data() {
    return {
      replyContent: ''
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
    }
  },
  created() {
    this.comment.showReplies = false;
  }
});
</script>