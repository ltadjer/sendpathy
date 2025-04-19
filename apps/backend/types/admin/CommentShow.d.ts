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
declare const CommentsShow: React.FC<CommentsShowProps>;
export default CommentsShow;
