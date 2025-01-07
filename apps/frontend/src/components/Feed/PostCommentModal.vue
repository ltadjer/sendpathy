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
        <comment-item
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          :post-id="postId"
        ></comment-item>
      </ion-list>
      <ion-item>
        <ion-input v-model="newComment" placeholder="Add a comment..."></ion-input>
        <ion-button @click="addComment">Add</ion-button>
      </ion-item>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonList, IonItem, IonInput } from '@ionic/vue';
import CommentItem from './CommentItem.vue';
import { useCommentStore } from '@/stores/comment'
import { usePostStore } from '@/stores/post'

export default defineComponent({
  name: 'PostCommentModal',
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
    IonInput,
    CommentItem
  },
  props: {
    comments: Array,
    postId: String
  },
  data() {
    return {
      newComment: ''
    };
  },
  emits: ['close', 'update-comments'],
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async addComment() {
      await usePostStore().addCommentToPost(this.postId, { content: this.newComment });
      this.newComment = '';
    },
  }
});
</script>