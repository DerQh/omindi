import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled from "styled-components";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #eef7ee;
  padding: 20px 24px 40px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const BackButton = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 1.2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;

  &:hover {
    background: #245026;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #2f5a2a;
  flex: 1;
  text-align: center;
`;

const PostCard = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  box-shadow: 0 12px 30px rgba(34, 79, 38, 0.08);
  overflow: hidden;
  margin-bottom: 32px;
`;

const PostHeader = styled.div`
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid #ecf2eb;
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
`;

const PostInfo = styled.div`
  flex: 1;

  h3 {
    margin: 0 0 4px;
    color: #243a20;
    font-size: 1.2rem;
  }

  p {
    margin: 0;
    color: #5b6d57;
    font-size: 0.95rem;
  }
`;

const PostType = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ type }) => {
    switch (type) {
      case "update":
        return "#e8f5e8";
      case "news":
        return "#fff3cd";
      case "event":
        return "#d1ecf1";
      case "market":
        return "#f8d7da";
      default:
        return "#f4f4f4";
    }
  }};
  color: ${({ type }) => {
    switch (type) {
      case "update":
        return "#2f5a2a";
      case "news":
        return "#856404";
      case "event":
        return "#0c5460";
      case "market":
        return "#721c24";
      default:
        return "#6c757d";
    }
  }};
`;

const PostContent = styled.div`
  padding: 24px;

  h4 {
    margin: 0 0 16px;
    color: #243a20;
    font-size: 1.4rem;
  }

  p {
    margin: 0;
    color: #556652;
    line-height: 1.7;
    font-size: 1.1rem;
  }
`;

const PostImage = styled.div`
  width: 100%;
  height: 400px;
  background: #dceedf;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PostActions = styled.div`
  padding: 20px 24px;
  border-top: 1px solid #ecf2eb;
  display: flex;
  gap: 24px;
  align-items: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: none;
  color: ${({ liked }) => (liked ? "#e74c3c" : "#5b6d57")};
  cursor: pointer;
  font-size: 1rem;
  padding: 10px 16px;
  border-radius: 12px;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: #f4faf4;
    color: ${({ liked }) => (liked ? "#c0392b" : "#2f5a2a")};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const PostStats = styled.div`
  display: flex;
  gap: 20px;
  color: #7b8f7f;
  font-size: 0.95rem;
`;

const CommentsSection = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  box-shadow: 0 12px 30px rgba(34, 79, 38, 0.08);
  overflow: hidden;
`;

const CommentsHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #ecf2eb;

  h3 {
    margin: 0;
    color: #2f5a2a;
    font-size: 1.2rem;
  }
`;

const CommentList = styled.div`
  padding: 0 24px;
`;

const Comment = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid #f4faf4;

  &:last-child {
    border-bottom: none;
  }

  display: flex;
  gap: 12px;
`;

const CommentAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const CommentContent = styled.div`
  flex: 1;

  .author {
    font-weight: 600;
    color: #243a20;
    margin-bottom: 4px;
  }

  .text {
    color: #556652;
    line-height: 1.5;
    margin-bottom: 4px;
  }

  .time {
    font-size: 0.85rem;
    color: #7b8f7f;
  }
`;

const AddComment = styled.div`
  padding: 20px 24px;
  border-top: 1px solid #ecf2eb;
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

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

const communityPosts = [
  {
    id: 1,
    author: "Amina's Farm",
    avatar: "/farm logo.png",
    type: "update",
    title: "Fresh Harvest This Week!",
    content:
      "Just harvested our first batch of organic cherry tomatoes this season. They're sweet, juicy, and ready for pickup! Available at the Saturday market or direct from the farm.",
    image: "/tomatoes.jpg",
    likes: 24,
    comments: 8,
    shares: 3,
    liked: false,
    time: "2 hours ago",
    commentsList: [
      {
        id: 1,
        author: "John Farmer",
        avatar: "https://picsum.photos/200",
        text: "Congratulations on the harvest! Looking forward to trying them.",
        time: "1 hour ago",
      },
      {
        id: 2,
        author: "Sarah Buyer",
        avatar: "https://picsum.photos/300",
        text: "Will you have them at the market this weekend?",
        time: "45 minutes ago",
      },
    ],
  },
  // ... other posts with similar structure
];

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState(communityPosts);
  const [newComment, setNewComment] = useState("");

  const post = posts.find((p) => p.id === parseInt(id));

  const handleBack = () => {
    navigate(-1);
  };

  const handleLike = () => {
    setPosts(
      posts.map((p) =>
        p.id === post.id
          ? {
              ...p,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
              liked: !p.liked,
            }
          : p,
      ),
    );
  };

  const handleComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        author: "You",
        avatar: "/user.jpg",
        text: newComment,
        time: "Just now",
      };
      setPosts(
        posts.map((p) =>
          p.id === post.id
            ? {
                ...p,
                comments: p.comments + 1,
                commentsList: [...p.commentsList, comment],
              }
            : p,
        ),
      );
      setNewComment("");
    }
  };

  const handleShare = () => {
    setPosts(
      posts.map((p) => (p.id === post.id ? { ...p, shares: p.shares + 1 } : p)),
    );
  };

  if (!post) {
    return (
      <PageWrapper>
        <AppNavbar />
        <Header>
          <BackButton onClick={handleBack}>←</BackButton>
          <Title>Post Not Found</Title>
        </Header>
      </PageWrapper>
    );
  }

  return (
    <>
      <AppNavbar />
      <PageWrapper>
        <Header>
          <BackButton onClick={handleBack}>←</BackButton>
          <Title>Post Details</Title>
        </Header>

        <PostCard>
          <PostHeader>
            <Avatar src={post.avatar} alt={post.author} />
            <PostInfo>
              <h3>{post.author}</h3>
              <p>{post.time}</p>
            </PostInfo>
            <PostType type={post.type}>{post.type}</PostType>
          </PostHeader>

          <PostContent>
            <h4>{post.title}</h4>
            <p>{post.content}</p>
          </PostContent>

          {post.image && (
            <PostImage>
              <img src={post.image} alt={post.title} />
            </PostImage>
          )}

          <PostActions>
            <ActionButton liked={post.liked} onClick={handleLike}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Like
            </ActionButton>
            <ActionButton onClick={handleComment}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
              </svg>
              Comment
            </ActionButton>
            <ActionButton onClick={handleShare}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
              </svg>
              Share
            </ActionButton>
            <PostStats>
              <span>{post.likes} likes</span>
              <span>{post.comments} comments</span>
              <span>{post.shares} shares</span>
            </PostStats>
          </PostActions>
        </PostCard>

        <CommentsSection>
          <CommentsHeader>
            <h3>Comments ({post.comments})</h3>
          </CommentsHeader>
          <CommentList>
            {post.commentsList.map((comment) => (
              <Comment key={comment.id}>
                <CommentAvatar src={comment.avatar} alt={comment.author} />
                <CommentContent>
                  <div className="author">{comment.author}</div>
                  <div className="text">{comment.text}</div>
                  <div className="time">{comment.time}</div>
                </CommentContent>
              </Comment>
            ))}
          </CommentList>
          <AddComment>
            <CommentInput
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="2"
            />
            <CommentButton onClick={handleComment}>Post</CommentButton>
          </AddComment>
        </CommentsSection>
      </PageWrapper>
    </>
  );
};

export default Post;
