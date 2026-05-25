import { useState } from "react";
import { useTestComment } from "../../hooks/useTest";
import styled from "styled-components";
import { useCreateComment } from "../../hooks/usePostComment";
import { useQueryClient } from "@tanstack/react-query";

const CommentInput = styled.textarea`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  resize: none;
  font-family: inherit;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: #2f5a2a;
  }
`;

const CommentButton = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.95rem;

  &:hover {
    background: #245026;
  }
`;

const AddComment = styled.form`
  padding: 20px 24px;
  border-top: 1px solid #ecf2eb;
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

export function CommentsComponent({ post_id }) {
  const [content, setContent] = useState("");
  const { mutate, isPending } = useCreateComment();
    const queryClient = useQueryClient();


  const handleSubmitComment = (event) => {
    event.preventDefault();

    mutate(
      {
        post_id,
        content,
      },
      {
        // After successfully
        onSuccess: () => {
          setContent("");
          queryClient.invalidateQueries({
            queryKey: ["post_comments", post_id],
          });
        },
      },
    );
  };

  return (
    <AddComment onSubmit={handleSubmitComment}>
      <CommentInput
        type="text"
        value={content}
        placeholder="content here"
        onChange={(e) => setContent(e.target.value)}
      />
      <CommentButton type="submit">Post</CommentButton>
    </AddComment>
  );
}
