<template>
  <ion-modal :is-open="true" @didDismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title>Comments</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item v-for="comment in comments" :key="comment.id">
          <p>{{ comment.content }}</p>
          <ion-button @click="editComment(comment)">Edit</ion-button>
          <ion-button @click="deleteComment(comment.id)">Delete</ion-button>
          <ion-list v-if="comment.replies">
            <ion-item v-for="reply in comment.replies" :key="reply.id">
              <p>{{ reply.content }}</p>
            </ion-item>
          </ion-list>
        </ion-item>
      </ion-list>
      <ion-item>
        <ion-input v-model="newComment" placeholder="Add a comment..."></ion-input>
        <ion-button @click="addComment">Add</ion-button>
      </ion-item>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonList, IonItem, IonInput } from '@ionic/vue';
import commentService from '@/services/comment.service';

export default defineComponent({
  name: 'CommentModal',
  components: {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonInput
  },
  props: {
    comments: Array,
    postId: String
  },
  data() {
    return {
      newComment: '',
      editingComment: null
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async deleteComment(commentId) {
      await commentService.deleteCommentFromPost(this.postId, commentId);
      this.comments = this.comments.filter(comment => comment.id !== commentId);
    },
    editComment(comment) {
      this.editingComment = comment;
      this.newComment = comment.content;
    },
    async addComment() {
      if (this.editingComment) {
        await commentService.updateComment(this.editingComment.id, { content: this.newComment });
        this.editingComment.content = this.newComment;
        this.editingComment = null;
      } else {
        await commentService.addCommentToPost(this.postId, { content: this.newComment });
      }
      this.newComment = '';
      this.comments = await commentService.fetchAllCommentOfPost(this.postId); // Update comments after adding
    }
  }
});
</script>