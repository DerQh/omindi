import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled from "styled-components";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #eef7ee;
  padding: 20px 24px 40px;
`;

const PageTitle = styled.h1`
  margin: 0 0 18px;
  color: #264a28;
  font-size: 2.3rem;
  text-align: center;
`;

const FeedContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PostCard = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 12px 30px rgba(34, 79, 38, 0.08);
  margin-bottom: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const PostHeader = styled.div`
  padding: 20px 24px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid #ecf2eb;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const PostInfo = styled.div`
  flex: 1;

  h3 {
    margin: 0 0 4px;
    color: #243a20;
    font-size: 1.1rem;
  }

  p {
    margin: 0;
    color: #5b6d57;
    font-size: 0.9rem;
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
      case 'update': return '#e8f5e8';
      case 'news': return '#fff3cd';
      case 'event': return '#d1ecf1';
      case 'market': return '#f8d7da';
      default: return '#f4f4f4';
    }
  }};
  color: ${({ type }) => {
    switch (type) {
      case 'update': return '#2f5a2a';
      case 'news': return '#856404';
      case 'event': return '#0c5460';
      case 'market': return '#721c24';
      default: return '#6c757d';
    }
  }};
`;

const PostContent = styled.div`
  padding: 20px 24px;

  h4 {
    margin: 0 0 12px;
    color: #243a20;
    font-size: 1.2rem;
  }

  p {
    margin: 0 0 16px;
    color: #556652;
    line-height: 1.6;
  }
`;

const PostImage = styled.div`
  width: 100%;
  height: 280px;
  background: #dceedf;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PostActions = styled.div`
  padding: 16px 24px 20px;
  border-top: 1px solid #ecf2eb;
  display: flex;
  gap: 20px;
  align-items: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: none;
  color: ${({ liked }) => (liked ? '#e74c3c' : '#5b6d57')};
  cursor: pointer;
  font-size: 0.95rem;
  padding: 8px 12px;
  border-radius: 12px;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: #f4faf4;
    color: ${({ liked }) => (liked ? '#c0392b' : '#2f5a2a')};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const PostStats = styled.div`
  display: flex;
  gap: 16px;
  color: #7b8f7f;
  font-size: 0.9rem;
`;

const NewPostCard = styled(PostCard)`
  background: linear-gradient(135deg, #f8faf6 0%, #eef7ee 100%);
  border: 2px dashed #c8e6c9;
`;

const NewPostContent = styled.div`
  padding: 32px 24px;
  text-align: center;

  h3 {
    margin: 0 0 12px;
    color: #2f5a2a;
    font-size: 1.3rem;
  }

  p {
    margin: 0 0 20px;
    color: #5b6d57;
    line-height: 1.6;
  }
`;

const ShareButton = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;

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
    content: "Just harvested our first batch of organic cherry tomatoes this season. They're sweet, juicy, and ready for pickup! Available at the Saturday market or direct from the farm.",
    image: "/salepic.png",
    likes: 24,
    comments: 8,
    shares: 3,
    liked: false,
    time: "2 hours ago",
  },
  {
    id: 2,
    author: "Farmers Market Association",
    avatar: "/market.png",
    type: "news",
    title: "New Organic Certification Program",
    content: "Exciting news! We're launching a new organic certification program for small farmers. This will help you reach more customers and get premium pricing for your certified organic produce.",
    image: "/howtouse1.png",
    likes: 42,
    comments: 15,
    shares: 7,
    liked: false,
    time: "5 hours ago",
  },
  {
    id: 3,
    author: "Honey Harvest Co-op",
    avatar: "/farming.jpg",
    type: "event",
    title: "Beekeeping Workshop - June 15th",
    content: "Join us for a hands-on beekeeping workshop! Learn about hive management, honey extraction, and sustainable beekeeping practices. Perfect for new and experienced beekeepers.",
    image: "/howtouse2.png",
    likes: 31,
    comments: 12,
    shares: 5,
    liked: false,
    time: "1 day ago",
  },
  {
    id: 4,
    author: "Local Market Hub",
    avatar: "/chat.png",
    type: "market",
    title: "Weekend Market Specials",
    content: "This weekend's market features special deals on seasonal produce! Don't miss out on discounted prices for bulk purchases and farmer-direct deals.",
    image: "/grow.png",
    likes: 18,
    comments: 6,
    shares: 2,
    liked: false,
    time: "2 days ago",
  },
  {
    id: 5,
    author: "Green Valley Organics",
    avatar: "/salepic.png",
    type: "update",
    title: "New Delivery Service Available",
    content: "We're excited to announce our new home delivery service! Now you can get fresh, locally-grown produce delivered right to your door. Minimum order $25, free delivery over $50.",
    image: "/farm logo.png",
    likes: 35,
    comments: 22,
    shares: 9,
    liked: false,
    time: "3 days ago",
  },
];

const Community = () => {
  const [posts, setPosts] = useState(communityPosts);
  const navigate = useNavigate();

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            liked: !post.liked
          }
        : post
    ));
  };

  const handleComment = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: post.comments + 1 }
        : post
    ));
  };

  const handleShare = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, shares: post.shares + 1 }
        : post
    ));
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleShareUpdate = () => {
    navigate('/update');
  };

  return (
    <>
      <AppNavbar />
      <PageWrapper>
        <PageTitle>Community Feed</PageTitle>
        <FeedContainer>
          <NewPostCard>
            <NewPostContent>
              <h3>Share What's New</h3>
              <p>Post updates about your farm, share market tips, or announce upcoming events with the community.</p>
              <ShareButton onClick={handleShareUpdate}>Share Update</ShareButton>
            </NewPostContent>
          </NewPostCard>

          {posts.map((post) => (
            <PostCard key={post.id} onClick={() => handlePostClick(post.id)}>
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
                <ActionButton 
                  liked={post.liked} 
                  onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  Like
                </ActionButton>
                <ActionButton onClick={(e) => { e.stopPropagation(); handleComment(post.id); }}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                  </svg>
                  Comment
                </ActionButton>
                <ActionButton onClick={(e) => { e.stopPropagation(); handleShare(post.id); }}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
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
          ))}
        </FeedContainer>
      </PageWrapper>
    </>
  );
};

export default Community;