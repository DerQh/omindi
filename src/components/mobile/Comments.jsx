import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useCreateComment } from "../../hooks/usePostComment";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../hooks/useUser";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const MAX = 400;

export function CommentsComponent({ post_id }) {
  const [content, setContent] = useState("");
  const [focused, setFocused] = useState(false);
  const { mutate, isPending } = useCreateComment();
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    mutate(
      { post_id, content: content.trim() },
      {
        onSuccess: () => {
          setContent("");
          setFocused(false);
          queryClient.invalidateQueries({ queryKey: ["post_comments", post_id] });
        },
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(e);
  };

  return (
    <Wrap onSubmit={handleSubmit}>
      <Avatar
        src={user?.profile?.avatar_url || "/user.jpg"}
        alt="You"
        onError={(e) => { e.target.src = "/user.jpg"; }}
      />
      <InputWrap $focused={focused}>
        <Textarea
          value={content}
          placeholder="Write a comment…"
          rows={focused ? 3 : 1}
          maxLength={MAX}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { if (!content) setFocused(false); }}
          onKeyDown={handleKeyDown}
        />
        {focused && (
          <Footer>
            <CharCount $warn={content.length > MAX * 0.85}>
              {content.length}/{MAX}
            </CharCount>
            <Actions>
              <CancelBtn
                type="button"
                onClick={() => { setContent(""); setFocused(false); }}
              >
                Cancel
              </CancelBtn>
              <SendBtn type="submit" disabled={!content.trim() || isPending}>
                {isPending ? "Posting…" : "Post"}
              </SendBtn>
            </Actions>
          </Footer>
        )}
      </InputWrap>
    </Wrap>
  );
}

const Wrap = styled.form`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 16px 20px 20px;
  border-top: 1px solid #f0f7ee;
  animation: ${fadeUp} 0.2s ease;
`;

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid #e8f5e9;
  margin-top: 2px;
`;

const InputWrap = styled.div`
  flex: 1;
  background: ${({ $focused }) => ($focused ? "white" : "#f5f8f5")};
  border: 1.5px solid ${({ $focused }) => ($focused ? "#2f5a2a" : "#e5e7eb")};
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.2s, background 0.2s;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  color: #1a3318;
  font-family: inherit;
  resize: none;
  outline: none;
  line-height: 1.55;
  box-sizing: border-box;
  &::placeholder { color: #aab8aa; }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px 10px;
  animation: ${fadeUp} 0.18s ease;
`;

const CharCount = styled.span`
  font-size: 0.75rem;
  color: ${({ $warn }) => ($warn ? "#d97706" : "#9ca3af")};
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const CancelBtn = styled.button`
  padding: 6px 14px;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  background: white;
  color: #6b7280;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #f9fafb; }
`;

const SendBtn = styled.button`
  padding: 6px 16px;
  border-radius: 8px;
  border: none;
  background: #2f5a2a;
  color: white;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #245026; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
