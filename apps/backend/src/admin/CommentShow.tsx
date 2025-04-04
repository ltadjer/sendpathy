// File: apps/backend/src/admin/comments-show.tsx
import * as React from 'react';

interface CommentsShowProps {
  record: {
    params: {
      comments?: {
        id?: string;
        content?: string;
        userId?: string;
        parentId?: string | null;
        createdAt?: string;
      }[];
    };
  };
}

const CommentsShow: React.FC<CommentsShowProps> = ({ record }) => {
  const comments = record.params.comments;

  if (!comments || comments.length === 0) {
    return <div>No comments available.</div>;
  }

  return (
    <div>
      <h3>Comments</h3>
      {comments.map((comment, index) => (
        <div
          key={comment.id || index}
          style={{
            borderBottom: '1px solid #ccc',
            marginBottom: '10px',
            paddingBottom: '10px',
          }}
        >
          <p><strong>ID:</strong> {comment.id}</p>
          <p><strong>Content:</strong> {comment.content}</p>
          <p><strong>User ID:</strong> {comment.userId}</p>
          <p><strong>Parent ID:</strong> {comment.parentId || 'N/A'}</p>
          <p><strong>Created At:</strong> {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'N/A'}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentsShow;