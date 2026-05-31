import { useState } from "react";
import { useTestComment } from "../../hooks/useTest";
import styled from "styled-components";

const CommentInput = styled.textarea`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  resize: none;
  font-family: inherit;
  font-size: 16px;

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

export function TestHooks() {
  const [user_name, setUserName] = useState("");
  const [content, setContent] = useState("");
  const { mutate, isPending } = useTestComment();
  let post_id = "5a0a986c-6d72-4d5c-9838-0cbf7c1eeb45";

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
          console.log(" -- - -  - - - - - - - -- - ");
          setContent("");
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
      <CommentButton type="submit">Submit</CommentButton>
    </AddComment>
  );
}
