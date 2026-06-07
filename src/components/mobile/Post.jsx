import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes } from "styled-components";
import { usePost, useToggleLike, useLikeStatus } from "../../hooks/usePosts";
import { formatSmartDate } from "../../hooks/dateFormat";
import LoadingComponent from "./Loading";
import { CommentsComponent } from "./Comments";
import { useFetchPostComments } from "../../hooks/usePostComment";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const popIn = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
`;

const TAG_STYLES = {
  update: { bg: "#ecfdf5", color: "#065f46" },
  news: { bg: "#fefce8", color: "#854d0e" },
  event: { bg: "#eff6ff", color: "#1e40af" },
  market: { bg: "#fdf4ff", color: "#7e22ce" },
};
const TYPE_LABELS = {
  update: "Update",
  news: "News",
  event: "Event",
  market: "Market",
};

const COMMENTS_PER_PAGE = 5;

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: post, isLoading: postLoading } = usePost(id);
  const { data: liked } = useLikeStatus(id);
  const { data: comments, isLoading: commentsLoading } =
    useFetchPostComments(id);
  const toggleLike = useToggleLike(id);

  const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);

  const visibleComments = comments?.slice(0, visibleCount) ?? [];
  const hasMore = comments && visibleCount < comments.length;

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${id}`;
    if (navigator.share) {
      await navigator
        .share({ title: post?.title, text: post?.content, url })
        .catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
    }
  };

  if (postLoading || commentsLoading) return <LoadingComponent />;

  if (!post) {
    return (
      <>
        <AppNavbar />
        <Page>
          <NotFound>
            <NotFoundIcon>🔍</NotFoundIcon>
            <NotFoundTitle>Post not found</NotFoundTitle>
            <BackBtn onClick={() => navigate(-1)}>Go back</BackBtn>
          </NotFound>
        </Page>
      </>
    );
  }

  const tagStyle = TAG_STYLES[post.type] ?? { bg: "#f3f4f6", color: "#6b7280" };

  return (
    <>
      <AppNavbar />
      <Page>
        {/* ── Sticky header ── */}
        <StickyHeader>
          <StatChip onClick={() => navigate(-1)} aria-label="Go back">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </StatChip>
          <HeaderTitle>Post</HeaderTitle>
          <HeaderSpacer />
        </StickyHeader>

        <Body>
          {/* ── Post card ── */}
          <PostCard>
            {/* Author row */}
            <PostHeader>
              <Avatar
                src={post.user_image_url || "/user.jpg"}
                alt={post.author}
              />
              <PostMeta>
                <AuthorName>{post.author || "Farmer"}</AuthorName>
                <PostTime>{formatSmartDate(post.created_at)}</PostTime>
              </PostMeta>
              {post.type && (
                <TypeBadge
                  style={{ background: tagStyle.bg, color: tagStyle.color }}
                >
                  {TYPE_LABELS[post.type] ?? post.type}
                </TypeBadge>
              )}
            </PostHeader>

            {/* Content */}
            <PostBody>
              {post.title && <PostTitle>{post.title}</PostTitle>}
              {post.content && <PostText>{post.content}</PostText>}
            </PostBody>

            {/* Image */}
            {post.image_url && (
              <PostImage>
                <img src={post.image_url} alt={post.title} loading="lazy" decoding="async" />
              </PostImage>
            )}

            {/* Actions */}
            <PostActions>
              <ActionBtn
                $liked={liked}
                onClick={() => toggleLike.mutate()}
                disabled={toggleLike.isPending}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={liked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {liked ? "Liked" : "Like"}
                {post.likes > 0 && <StatPill>{post.likes}</StatPill>}
              </ActionBtn>

              <ActionBtn
                onClick={() =>
                  document.getElementById("comment-input")?.focus()
                }
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Comment
                {comments?.length > 0 && <StatPill>{comments.length}</StatPill>}
              </ActionBtn>

              <ActionBtn onClick={handleShare}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Share
                {post.shares > 0 && <StatPill>{post.shares}</StatPill>}
              </ActionBtn>
            </PostActions>
          </PostCard>

          {/* ── Comments ── */}
          <CommentsCard>
            <CommentsHeader>
              <CommentHeaderTitle>
                {comments?.length
                  ? `${comments.length} Comment${comments.length !== 1 ? "s" : ""}`
                  : "Comments"}
              </CommentHeaderTitle>
            </CommentsHeader>

            {visibleComments.length === 0 ? (
              <EmptyComments>
                <span>💬</span>
                <p>No comments yet. Be the first!</p>
              </EmptyComments>
            ) : (
              <CommentList>
                {visibleComments.map((c) => (
                  <CommentItem key={c.id}>
                    <CommentAvatar
                      src={c.image_url || "/user.jpg"}
                      alt={c.author}
                      onClick={() => navigate(`/follower/${c.user_id}`)}
                    />
                    <CommentBubble>
                      <CommentAuthor>{c.author || "Farmer"}</CommentAuthor>
                      <CommentText>{c.content}</CommentText>
                      <CommentTime>{formatSmartDate(c.created_at)}</CommentTime>
                    </CommentBubble>
                  </CommentItem>
                ))}

                {hasMore && (
                  <ViewMoreBtn
                    onClick={() =>
                      setVisibleCount((n) => n + COMMENTS_PER_PAGE)
                    }
                  >
                    View{" "}
                    {Math.min(
                      COMMENTS_PER_PAGE,
                      comments.length - visibleCount,
                    )}{" "}
                    more comments
                  </ViewMoreBtn>
                )}
              </CommentList>
            )}

            {/* Add comment */}
            <CommentsComponent post_id={id} inputId="comment-input" />
          </CommentsCard>
        </Body>
      </Page>
    </>
  );
};

export default Post;

// ─── Styled components ────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
`;

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 80;
  background: white;
  border-bottom: 1px solid #e8f5e9;
  padding: 0 16px;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 8px rgba(20, 57, 32, 0.06);
  max-width: 960px;
  margin: 0 auto;
`;
const HeaderBack = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #1a3318;
  flex-shrink: 0;
  transition: background 0.15s;
  &:hover {
    background: #f0fdf4;
  }
`;
const StatChip = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(2, 2, 2, 0.25);
  border-radius: 50%;
  padding: 10px 10px;
  color: black;
  display: flex;
  align-items: center;
  gap: 6px;
`;
const HeaderTitle = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 1rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0;
  letter-spacing: -0.2px;
`;
const HeaderSpacer = styled.div`
  width: 36px;
  flex-shrink: 0;
`;

const Body = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 20px 16px 60px;
  animation: ${fadeUp} 0.35s ease;
`;

// Post card
const PostCard = styled.div`
  background: white;
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid #e8f5e9;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
`;
const PostHeader = styled.div`
  padding: 18px 20px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #f3f4f6;
`;
const Avatar = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e8f5e9;
  flex-shrink: 0;
  cursor: pointer;
`;
const PostMeta = styled.div`
  flex: 1;
  min-width: 0;
`;
const AuthorName = styled.p`
  font-size: 0.94rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 2px;
`;
const PostTime = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
`;
const TypeBadge = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 11px;
  border-radius: 999px;
  white-space: nowrap;
  text-transform: capitalize;
  flex-shrink: 0;
`;

const PostBody = styled.div`
  padding: 20px 20px 16px;
`;
const PostTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 900;
  color: #1a3318;
  margin: 0 0 12px;
  letter-spacing: -0.3px;
  line-height: 1.35;
`;
const PostText = styled.p`
  font-size: 0.95rem;
  color: #4b5563;
  line-height: 1.75;
  margin: 0;
`;

const PostImage = styled.div`
  width: 100%;
  max-height: 420px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const PostActions = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  gap: 4px;
`;
const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 0.84rem;
  font-weight: 600;
  transition:
    background 0.15s,
    color 0.15s;
  color: ${({ $liked }) => ($liked ? "#ef4444" : "#6b7280")};
  &:hover {
    background: #f0fdf4;
    color: ${({ $liked }) => ($liked ? "#dc2626" : "#2f5a2a")};
  }
  &:disabled {
    opacity: 0.6;
  }
`;
const StatPill = styled.span`
  background: #f3f4f6;
  color: #6b7280;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
`;

// Comments card
const CommentsCard = styled.div`
  background: white;
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid #e8f5e9;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
`;
const CommentsHeader = styled.div`
  padding: 18px 20px;
  border-bottom: 1px solid #f3f4f6;
`;
const CommentHeaderTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0;
`;

const CommentList = styled.div`
  padding: 8px 20px 0;
`;
const CommentItem = styled.div`
  display: flex;
  gap: 10px;
  padding: 14px 0;
  border-bottom: 1px solid #f9fafb;
  &:last-of-type {
    border-bottom: none;
  }
  animation: ${popIn} 0.2s ease;
`;
const CommentAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  cursor: pointer;
  border: 1.5px solid #e8f5e9;
`;
const CommentBubble = styled.div`
  flex: 1;
  background: #f8faf6;
  border-radius: 0 14px 14px 14px;
  padding: 10px 14px;
`;
const CommentAuthor = styled.p`
  font-size: 0.82rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 4px;
`;
const CommentText = styled.p`
  font-size: 0.88rem;
  color: #4b5563;
  line-height: 1.55;
  margin: 0 0 6px;
`;
const CommentTime = styled.p`
  font-size: 0.72rem;
  color: #9ca3af;
  margin: 0;
`;

const ViewMoreBtn = styled.button`
  display: block;
  width: 100%;
  background: none;
  border: none;
  color: #2f5a2a;
  font-weight: 700;
  font-size: 0.84rem;
  cursor: pointer;
  padding: 12px;
  text-align: center;
  &:hover {
    text-decoration: underline;
  }
`;

const EmptyComments = styled.div`
  text-align: center;
  padding: 32px 20px;
  span {
    font-size: 2rem;
    display: block;
    margin-bottom: 8px;
  }
  p {
    font-size: 0.88rem;
    color: #9ca3af;
    margin: 0;
  }
`;

// Not found
const NotFound = styled.div`
  text-align: center;
  padding: 100px 24px;
`;
const NotFoundIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;
const NotFoundTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 20px;
`;
const BackBtn = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 11px 24px;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
`;
