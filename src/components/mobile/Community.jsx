import { useState, useMemo, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes, css } from "styled-components";
import { usePosts, useToggleLike, useLikeStatus } from "../../hooks/usePosts";
import { formatSmartDate } from "../../hooks/dateFormat";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const heartPop = keyframes`
  0%   { transform: scale(1); }
  25%  { transform: scale(1.5); }
  50%  { transform: scale(0.88); }
  75%  { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const TAG_STYLES = {
  update: { bg: "#ecfdf5", color: "#065f46" },
  news: { bg: "#fefce8", color: "#854d0e" },
  event: { bg: "#eff6ff", color: "#1e40af" },
  market: { bg: "#fdf4ff", color: "#7e22ce" },
};

const ALL_TYPES = ["All", "update", "news", "event", "market"];
const TYPE_LABELS = {
  update: "Update",
  news: "News",
  event: "Event",
  market: "Market",
};

// ─── Post card (self-contained so each can call hooks) ─────────────────────

function PostCard({ post, onClick, index }) {
  const { data: liked } = useLikeStatus(post.id);
  const toggleLike = useToggleLike(post.id);
  const [popHeart, setPopHeart] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    setPopHeart(true);
    setTimeout(() => setPopHeart(false), 420);
    toggleLike.mutate();
  };

  const tagStyle = TAG_STYLES[post.type] ?? { bg: "#f3f4f6", color: "#6b7280" };

  return (
    <Card $index={index} onClick={() => onClick(post.id)}>
      <CardHeader>
        <Avatar src={post.user_image_url || "/user.jpg"} alt={post.author} />
        <CardMeta>
          <AuthorName>{post.author || "Farmer"}</AuthorName>
          <TimeText>{formatSmartDate(post.created_at)}</TimeText>
        </CardMeta>
        {post.type && (
          <TypeBadge style={{ background: tagStyle.bg, color: tagStyle.color }}>
            {TYPE_LABELS[post.type] ?? post.type}
          </TypeBadge>
        )}
      </CardHeader>

      <CardBody>
        {post.title && <CardTitle>{post.title}</CardTitle>}
        {post.content && <CardText>{post.content}</CardText>}
      </CardBody>

      {post.image_url && (
        <CardImage>
          <img src={post.image_url} alt={post.title} loading="lazy" />
        </CardImage>
      )}

      <CardFooter>
        <FooterBtn
          $liked={liked}
          $pop={popHeart}
          onClick={handleLike}
          disabled={toggleLike.isPending}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>{post.likes ?? 0}</span>
        </FooterBtn>

        <FooterBtn
          onClick={(e) => {
            e.stopPropagation();
            onClick(post.id);
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Comment</span>
        </FooterBtn>

        <FooterBtn
          onClick={async (e) => {
            e.stopPropagation();
            const url = `${window.location.origin}/post/${post.id}`;
            if (navigator.share) {
              await navigator
                .share({ title: post.title, text: post.content, url })
                .catch(() => {});
            } else {
              await navigator.clipboard.writeText(url).catch(() => {});
            }
          }}
        >
          <svg
            width="16"
            height="16"
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
          <span>{post.shares ?? 0}</span>
        </FooterBtn>
      </CardFooter>
    </Card>
  );
}

// ─── Community page ────────────────────────────────────────────────────────

const Community = () => {
  const { data: posts, isLoading, refetch } = usePosts();
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = useRef(0);

  const filtered = useMemo(() => {
    if (!posts) return [];
    if (activeType === "All") return posts;
    return posts.filter((p) => p.type === activeType);
  }, [posts, activeType]);

  const onTouchStart = useCallback((e) => { touchStartY.current = e.touches[0].clientY; }, []);
  const onTouchEnd = useCallback(async (e) => {
    const delta = e.changedTouches[0].clientY - touchStartY.current;
    if (window.scrollY === 0 && delta > 80) {
      setRefreshing(true);
      await refetch();
      setRefreshing(false);
    }
  }, [refetch]);

  return (
    <>
      <Helmet><title>Community — AFARMER™</title></Helmet>
            <AppNavbar />

      {/* ── Hero ── */}
      <Hero>
        <HeroBlob />
        <HeroInner>
          <HeroEyebrow>AFARMER™ Community</HeroEyebrow>
          <HeroTitle>Community Feed</HeroTitle>
          <HeroSub>Updates, news, and events from farmers near you.</HeroSub>
          <ShareBtn onClick={() => navigate("/update")}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Share Update
          </ShareBtn>
        </HeroInner>
      </Hero>

      {/* ── Filter chips ── */}
      <FilterBar>
        <FilterInner>
          {ALL_TYPES.map((t) => (
            <FilterChip
              key={t}
              $active={activeType === t}
              onClick={() => setActiveType(t)}
            >
              {t === "All" ? "All Posts" : TYPE_LABELS[t]}
              {t !== "All" && (
                <ChipCount $active={activeType === t}>
                  {posts?.filter((p) => p.type === t).length ?? 0}
                </ChipCount>
              )}
            </FilterChip>
          ))}
        </FilterInner>
      </FilterBar>

      {/* ── Feed ── */}
      <Feed onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {refreshing && <CommPullIndicator>↻ Refreshing…</CommPullIndicator>}
        <FeedInner>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <CommSkeletonCard key={i}>
                <CommSkeletonHeader>
                  <CommSkeletonCircle />
                  <div style={{ flex: 1 }}>
                    <CommSkeletonLine $w="40%" $h="14px" />
                    <CommSkeletonLine $w="25%" $h="11px" style={{ marginTop: 6 }} />
                  </div>
                </CommSkeletonHeader>
                <CommSkeletonLine $w="70%" $h="18px" style={{ marginBottom: 10 }} />
                <CommSkeletonLine $w="100%" $h="12px" />
                <CommSkeletonLine $w="90%" $h="12px" style={{ marginTop: 6 }} />
                <CommSkeletonImg />
              </CommSkeletonCard>
            ))
          ) : filtered.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🌿</EmptyIcon>
              <EmptyTitle>No posts yet</EmptyTitle>
              <EmptyText>
                {activeType === "All"
                  ? "Be the first to share something with the community."
                  : `No ${TYPE_LABELS[activeType]} posts yet.`}
              </EmptyText>
              <EmptyBtn onClick={() => navigate("/update")}>
                Share Update
              </EmptyBtn>
            </EmptyState>
          ) : (
            filtered.map((post, i) => (
              <PostCard
                key={post.id}
                post={post}
                index={i}
                onClick={(id) => navigate(`/post/${id}`)}
              />
            ))
          )}
        </FeedInner>
      </Feed>
    </>
  );
};

export default Community;

// ─── Styled components ────────────────────────────────────────────────────────

const Hero = styled.div`
  /* background: linear-gradient(
    135deg,
    #0d2410 0%,
    #1a3318 45%,
    #2f5a2a 80%,
    #4e9643 100%
  ); */
  padding: 44px 24px 50px;
  position: relative;
  overflow: hidden;
  max-width: 960px;
  margin: 0 auto;
  border-radius: 0 0 28px 28px;
`;
const HeroBlob = styled.div`
  position: absolute;
  width: 340px;
  height: 340px;
  border-radius: 50%;
  background: rgba(78, 150, 67, 0.12);
  top: -100px;
  right: -80px;
  pointer-events: none;
`;
const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  animation: ${fadeUp} 0.5s ease;
`;
const HeroEyebrow = styled.span`
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(4, 4, 4, 0.6);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(6, 6, 6, 0.15);
  padding: 5px 14px;
  border-radius: 999px;
  margin-bottom: 14px;
`;
const HeroTitle = styled.h1`
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 900;
  color: black;
  margin: 0 0 10px;
  letter-spacing: -0.5px;
`;
const HeroSub = styled.p`
  font-size: 0.95rem;
  color: rgba(0, 0, 0, 0.68);
  margin: 0 0 24px;
  line-height: 1.6;
`;
const ShareBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: #2f5a2a;
  border: 2px solid black;
  padding: 12px 24px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

const FilterBar = styled.div`
  max-width: 960px;
  margin: 0 auto;
  background: white;
  border-bottom: 1px solid #e8f5e9;
  position: sticky;
  top: 60px;
  z-index: 80;
  box-shadow: 0 2px 8px rgba(20, 57, 32, 0.05);
`;
const FilterInner = styled.div`
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 12px 20px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const FilterChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  padding: 7px 16px;
  border-radius: 999px;
  border: 1.5px solid;
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 600;
  transition: all 0.15s;
  background: ${({ $active }) => ($active ? "#2f5a2a" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#4b5563")};
  border-color: ${({ $active }) => ($active ? "#2f5a2a" : "#e5e7eb")};
  &:hover {
    background: ${({ $active }) => ($active ? "#245026" : "#f0fdf4")};
    border-color: ${({ $active }) => ($active ? "#245026" : "#bbf7d0")};
  }
`;
const ChipCount = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  background: ${({ $active }) =>
    $active ? "rgba(255,255,255,0.25)" : "#f3f4f6"};
  color: ${({ $active }) => ($active ? "white" : "#9ca3af")};
  padding: 1px 7px;
  border-radius: 999px;
`;

const commShimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;

const commSkeleton = css`
  background: linear-gradient(90deg, #e8f0e8 25%, #f3f7f3 50%, #e8f0e8 75%);
  background-size: 800px 100%;
  animation: ${commShimmer} 1.4s infinite;
  border-radius: 8px;
`;

const CommPullIndicator = styled.div`
  text-align: center;
  padding: 10px;
  font-size: 0.82rem;
  color: #2f5a2a;
  font-weight: 600;
  background: #f0fdf4;
`;

const CommSkeletonCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #e8f5e9;
  box-shadow: 0 2px 12px rgba(20,57,32,0.05);
`;

const CommSkeletonHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const CommSkeletonCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  ${commSkeleton}
`;

const CommSkeletonLine = styled.div`
  height: ${({ $h }) => $h || "14px"};
  width: ${({ $w }) => $w || "100%"};
  ${commSkeleton}
`;

const CommSkeletonImg = styled.div`
  height: 180px;
  margin-top: 14px;
  border-radius: 12px;
  ${commSkeleton}
`;

const Feed = styled.div`
  background: white;
  min-height: 60vh;
`;
const FeedInner = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 20px 16px 40px;
`;

// Post card
const Card = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #e8f5e9;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(20, 57, 32, 0.06);
  cursor: pointer;
  transition: transform 0.22s, box-shadow 0.22s;
  animation: ${fadeUp} 0.38s ease both;
  animation-delay: ${({ $index }) => ($index ?? 0) * 0.06}s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(20, 57, 32, 0.11);
  }
  &:active {
    transform: scale(0.99);
  }
`;
const CardHeader = styled.div`
  padding: 16px 18px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #f3f4f6;
`;
const Avatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid #e8f5e9;
`;
const CardMeta = styled.div`
  flex: 1;
  min-width: 0;
`;
const AuthorName = styled.p`
  font-size: 0.9rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const TimeText = styled.p`
  font-size: 0.74rem;
  color: #9ca3af;
  margin: 0;
`;
const TypeBadge = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;
  text-transform: capitalize;
  flex-shrink: 0;
`;

const CardBody = styled.div`
  padding: 16px 18px;
`;
const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 8px;
  line-height: 1.4;
`;
const CardText = styled.p`
  font-size: 0.88rem;
  color: #4b5563;
  line-height: 1.65;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardImage = styled.div`
  width: 100%;
  height: 220px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s;
  }
  ${Card}:hover & img {
    transform: scale(1.03);
  }
`;

const CardFooter = styled.div`
  padding: 12px 18px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  gap: 4px;
  align-items: center;
`;
const FooterBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 7px 12px;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  transition:
    background 0.15s,
    color 0.15s;
  color: ${({ $liked }) => ($liked ? "#ef4444" : "#6b7280")};
  ${({ $pop }) => $pop && `animation: ${heartPop} 0.42s ease;`}
  &:active { transform: scale(0.92); }
  &:hover {
    background: #f0fdf4;
    color: ${({ $liked }) => ($liked ? "#dc2626" : "#2f5a2a")};
  }
  &:disabled {
    opacity: 0.6;
  }
`;

// Empty state
const EmptyState = styled.div`
  text-align: center;
  padding: 80px 24px;
`;
const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;
const EmptyTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 8px;
`;
const EmptyText = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 20px;
`;
const EmptyBtn = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 11px 24px;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #245026;
  }
`;
