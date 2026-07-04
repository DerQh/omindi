import { Fragment, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { css, keyframes } from "styled-components";
import { useAuth } from "../../context/AuthContext";
import {
  useConversations,
  useDeleteConversation,
  useDeleteMessage,
  useMarkMessagesRead,
  useMessages,
  useSendMessage,
} from "../../hooks/useMessages";
import { formatSmartDate } from "../../hooks/dateFormat";
import { X, MessageCircle, Trash2 } from "lucide-react";

// ─── Animations ───────────────────────────────────────────────────────────────

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
`;

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const GROUPING_MS = 3 * 60 * 1000;

const formatDayLabel = (dateStr) => {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

// ─── Avatar with initials fallback ────────────────────────────────────────────

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
`;

const AvatarInitials = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #2f5a2a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $size }) => Math.round($size * 0.35)}px;
  font-weight: 700;
  text-transform: uppercase;
  user-select: none;
`;

function AvatarWithFallback({ src, name, size = 44, style }) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        ...style,
      }}
    >
      {!failed ? (
        <AvatarImg src={src} alt={name} onError={() => setFailed(true)} />
      ) : (
        <AvatarInitials $size={size}>{name?.charAt(0) ?? "?"}</AvatarInitials>
      )}
    </div>
  );
}

// ─── Page Shell ───────────────────────────────────────────────────────────────

const Container = styled.div`
  min-height: 100vh;
  background: #f4f8f4;
`;

const PageHeader = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 28px 20px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: #1a3318;
  letter-spacing: -0.4px;
`;

const UnreadPill = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  color: #fff;
  background: #2f5a2a;
  border-radius: 999px;
  padding: 2px 8px;
`;

// ─── Layout ───────────────────────────────────────────────────────────────────

const Layout = styled.div`
  max-width: 960px;
  margin: 0 auto 48px;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 14px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

// ─── Conversation Panel ───────────────────────────────────────────────────────

const ConvPanel = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(20, 57, 32, 0.07);
  border: 1px solid #e8f0e8;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 180px);
  max-height: 720px;

  @media (max-width: 860px) {
    display: ${({ $hidden }) => ($hidden ? "none" : "flex")};
    height: calc(100vh - 180px);
  }
`;

const ConvPanelHeader = styled.div`
  padding: 14px 14px 12px;
  border-bottom: 1px solid #f0f7ee;
`;

const SearchWrap = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1.5px solid #e0ece0;
  border-radius: 24px;
  padding: 9px 36px 9px 16px;
  font-size: 16px;
  color: #1a3318;
  background: #f7fbf4;
  outline: none;
  font-family: inherit;
  transition:
    border-color 0.15s,
    background 0.15s;

  &::placeholder {
    color: #b0c8b0;
  }
  &:focus {
    border-color: #2f5a2a;
    background: #fff;
  }
`;

const ClearSearchBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  background: #c0d0c0;
  color: #fff;
  font-size: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: background 0.12s;

  &:hover {
    background: #8ea88e;
  }
`;

const ConvList = styled.div`
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #d7edd9 transparent;
`;

const ConvItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 11px 14px;
  border: none;
  background: ${({ $active }) => ($active ? "#f4f9f2" : "#fff")};
  box-shadow: ${({ $active }) => ($active ? "inset 3px 0 0 #2f5a2a" : "none")};
  cursor: pointer;
  text-align: left;
  transition: background 0.12s;
  border-bottom: 1px solid #f5f9f5;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: ${({ $active }) => ($active ? "#f4f9f2" : "#fafdf9")};
  }
`;

const ConvAvatarWrap = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const UnreadDot = styled.div`
  position: absolute;
  top: 1px;
  right: 1px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #2f5a2a;
  border: 2px solid #fff;
`;

const UnreadBadge = styled.span`
  background: #2f5a2a;
  color: #fff;
  font-size: 0.62rem;
  font-weight: 800;
  min-width: 17px;
  height: 17px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  flex-shrink: 0;
`;

const ConvMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

const ConvMetaTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 3px;
`;

const ConvMetaBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
`;

const ConvName = styled.p`
  margin: 0;
  font-size: 0.88rem;
  font-weight: ${({ $unread }) => ($unread ? "700" : "600")};
  color: #1a3318;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
`;

const ConvTime = styled.span`
  font-size: 0.68rem;
  color: #b0c8b0;
  flex-shrink: 0;
`;

const ConvSub = styled.p`
  margin: 0;
  color: #8ea88e;
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
`;

// ─── Chat Panel ───────────────────────────────────────────────────────────────

const ChatPanel = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(20, 57, 32, 0.07);
  border: 1px solid #e8f0e8;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: calc(100vh - 180px);
  max-height: 720px;
  animation: ${popIn} 0.2s ease;

  @media (max-width: 860px) {
    display: ${({ $hidden }) => ($hidden ? "none" : "flex")};
    height: calc(100vh - 180px);
  }
`;

const ChatHeader = styled.div`
  padding: 12px 14px;
  border-bottom: 1px solid #f0f7ee;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  flex-shrink: 0;
`;

const MobileBackBtn = styled.button`
  display: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid #e0ece0;
  background: none;
  color: #2f5a2a;
  font-size: 1rem;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition:
    background 0.12s,
    border-color 0.12s;

  &:hover {
    background: #f0f7ee;
    border-color: #2f5a2a;
  }

  @media (max-width: 860px) {
    display: flex;
  }
`;

const ChatHeaderInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChatHeaderName = styled.p`
  margin: 0 0 2px;
  font-size: 0.92rem;
  font-weight: 700;
  color: #1a3318;
`;

const ChatHeaderSub = styled.p`
  margin: 0;
  font-size: 0.73rem;
  color: #8ea88e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DeleteConvBtn = styled.button`
  background: none;
  border: none;
  font-size: 0.85rem;
  cursor: pointer;
  color: #ccdacc;
  padding: 6px 8px;
  border-radius: 8px;
  transition:
    background 0.12s,
    color 0.12s;
  flex-shrink: 0;

  &:hover {
    background: #fdf1f1;
    color: #a32d2d;
  }
`;

const ConfirmDeleteRow = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  flex-shrink: 0;
`;

const ConfirmBtn = styled.button`
  font-size: 0.74rem;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 20px;
  cursor: pointer;
  border: none;
  background: ${({ $danger }) => ($danger ? "#fdf1f1" : "#f0f7ee")};
  color: ${({ $danger }) => ($danger ? "#a32d2d" : "#2f5a2a")};
  transition: opacity 0.12s;

  &:hover {
    opacity: 0.75;
  }
`;

// ─── Chat Body ────────────────────────────────────────────────────────────────

const ChatBody = styled.div`
  flex: 1;
  padding: 16px 16px 8px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: #fbfdfb;
  scrollbar-width: thin;
  scrollbar-color: #d7edd9 transparent;
`;

// Date separator between messages from different days
const DateSep = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 16px 0 8px;
  flex-shrink: 0;
`;

const DateSepLine = styled.div`
  flex: 1;
  height: 1px;
  background: #e8f0e8;
`;

const DateSepLabel = styled.span`
  font-size: 0.68rem;
  font-weight: 600;
  color: #b0c8b0;
  white-space: nowrap;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 9px 13px;
  /* Radius: grouped messages flatten the top corner on the "sender side",
     last message in a group gets the tail (4px), others get a soft 8px. */
  border-radius: ${({ $fromOwner, $grouped, $isLast }) => {
    if ($fromOwner)
      return `18px ${$grouped ? "8px" : "18px"} ${$isLast ? "4px" : "8px"} 18px`;
    return `${$grouped ? "8px" : "18px"} 18px 18px ${$isLast ? "4px" : "8px"}`;
  }};
  background: ${({ $fromOwner }) => ($fromOwner ? "#2f5a2a" : "#eef7ec")};
  align-self: ${({ $fromOwner }) => ($fromOwner ? "flex-end" : "flex-start")};
  animation: ${({ $grouped }) =>
    $grouped
      ? "none"
      : css`
          ${slideUp} 0.18s ease
        `};
  flex-shrink: 0;
`;

const BubbleText = styled.p`
  margin: 0 0 4px;
  line-height: 1.55;
  font-size: 0.9rem;
  color: ${({ $fromOwner }) => ($fromOwner ? "#fff" : "#1a3318")};
  word-break: break-word;
`;

const BubbleMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

const BubbleTime = styled.span`
  font-size: 0.67rem;
  color: ${({ $fromOwner }) =>
    $fromOwner ? "rgba(255,255,255,0.5)" : "#b0c8b0"};
`;

const DeleteMsgBtn = styled.button`
  background: none;
  border: none;
  font-size: 0.6rem;
  color: ${({ $fromOwner }) =>
    $fromOwner ? "rgba(255,255,255,0.35)" : "#c0d0c0"};
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.12s;

  &:hover {
    color: ${({ $fromOwner }) =>
      $fromOwner ? "rgba(255,255,255,0.85)" : "#a32d2d"};
  }
`;

// ─── Empty States ─────────────────────────────────────────────────────────────

const EmptyWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 6px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 4px;
`;

const EmptyTitle = styled.p`
  margin: 0 0 4px;
  font-size: 0.93rem;
  font-weight: 700;
  color: #1a3318;
`;

const EmptyDesc = styled.p`
  margin: 0;
  font-size: 0.81rem;
  color: #8ea88e;
  max-width: 220px;
  line-height: 1.5;
`;

// ─── Input Area ───────────────────────────────────────────────────────────────

const InputArea = styled.form`
  padding: 12px 14px;
  border-top: 1px solid #f0f7ee;
  display: flex;
  gap: 8px;
  align-items: center;
  background: #fff;
  flex-shrink: 0;
`;

const MessageInput = styled.input`
  flex: 1;
  border: 1.5px solid #e0ece0;
  border-radius: 24px;
  padding: 10px 16px;
  font-size: 16px;
  color: #1a3318;
  background: #f7fbf4;
  outline: none;
  font-family: inherit;
  transition:
    border-color 0.15s,
    background 0.15s;

  &::placeholder {
    color: #b0c8b0;
  }
  &:focus {
    border-color: #2f5a2a;
    background: #fff;
  }
`;

const SendBtn = styled.button`
  border: none;
  border-radius: 24px;
  background: #2f5a2a;
  color: #fff;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 0.88rem;
  font-weight: 700;
  transition: background 0.15s;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: #245026;
  }
  &:disabled {
    background: #b8d0b6;
    cursor: not-allowed;
  }
`;

// ─── Loading Skeletons ────────────────────────────────────────────────────────

const SkeletonBase = styled.div`
  border-radius: 8px;
  background: linear-gradient(90deg, #eaf0ea 25%, #f2f7f2 50%, #eaf0ea 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite;
`;

const SkeletonConvItem = () => (
  <div
    style={{
      display: "flex",
      gap: 11,
      padding: "11px 14px",
      borderBottom: "1px solid #f5f9f5",
    }}
  >
    <SkeletonBase
      style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0 }}
    />
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <SkeletonBase style={{ height: 11, width: "45%" }} />
        <SkeletonBase style={{ height: 10, width: "18%" }} />
      </div>
      <SkeletonBase style={{ height: 9, width: "65%" }} />
    </div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const Messages = () => {
  const { user } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();

  const { data: conversations = [], isLoading } = useConversations(user?.id);
  const [activeId, setActiveId] = useState(null);
  const { data: messages = [] } = useMessages(activeId);
  const { mutate: sendMessage, isPending: sending } = useSendMessage();
  const { mutate: markRead } = useMarkMessagesRead();
  const { mutate: deleteMessage } = useDeleteMessage();
  const { mutate: deleteConversation } = useDeleteConversation();

  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [mobileView, setMobileView] = useState("list");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (state?.conversationId) {
      setActiveId(state.conversationId);
      setMobileView("chat");
    } else if (conversations.length > 0 && !activeId) {
      setActiveId(conversations[0]?.id);
    }
  }, [conversations, state]);

  useEffect(() => {
    if (activeId && user?.id) {
      markRead({ conversation_id: activeId, user_id: user?.id });
    }
  }, [activeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeConversation = conversations.find((c) => c.id === activeId);

  const getOtherPerson = (conversation) => {
    if (!conversation) return { name: "User", avatar: "/user.jpg" };
    const isBuyer = conversation.buyer_id === user?.id;
    const other = isBuyer ? conversation.seller : conversation.buyer;
    return {
      name: other?.full_name ?? "User",
      avatar: other?.avatar_url ?? "/user.jpg",
    };
  };

  const onSelectConv = (id) => {
    setActiveId(id);
    setMobileView("chat");
    setConfirmDeleteId(null);
  };

  const onSend = (e) => {
    e.preventDefault();
    if (!draft.trim() || !activeId) return;
    sendMessage({
      conversation_id: activeId,
      sender_id: user?.id,
      text: draft.trim(),
    });
    setDraft("");
  };

  const onDeleteConversation = () => {
    deleteConversation(activeId);
    setActiveId(conversations.find((c) => c.id !== activeId)?.id ?? null);
    setConfirmDeleteId(null);
    setMobileView("list");
  };

  const filteredConvs = conversations.filter((c) => {
    const { name } = getOtherPerson(c);
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const unreadTotal = conversations.filter((c) => c.unread_count > 0).length;
  const otherPerson = getOtherPerson(activeConversation);

  return (
    <>
      <Helmet>
        <title>Messages — AFARMER™</title>
      </Helmet>
      <AppNavbar />
      <Container>
        <PageHeader>
          <PageTitle>Messages</PageTitle>
          {unreadTotal > 0 && <UnreadPill>{unreadTotal} unread</UnreadPill>}
        </PageHeader>

        <Layout>
          {/* ── Left: Conversation list ── */}
          <ConvPanel $hidden={mobileView === "chat"}>
            <ConvPanelHeader>
              <SearchWrap>
                <SearchInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations…"
                />
                {search && (
                  <ClearSearchBtn onClick={() => setSearch("")}>
                    <X size={16} />
                  </ClearSearchBtn>
                )}
              </SearchWrap>
            </ConvPanelHeader>

            <ConvList>
              {isLoading && (
                <>
                  <SkeletonConvItem />
                  <SkeletonConvItem />
                  <SkeletonConvItem />
                  <SkeletonConvItem />
                </>
              )}

              {!isLoading && filteredConvs.length === 0 && (
                <EmptyWrap>
                  <EmptyIcon><MessageCircle size={36} color="#4a7c45" /></EmptyIcon>
                  <EmptyTitle>
                    {search ? "No results" : "No conversations yet"}
                  </EmptyTitle>
                  <EmptyDesc>
                    {search
                      ? `No contacts matching "${search}"`
                      : "When buyers or sellers message you, they'll appear here."}
                  </EmptyDesc>
                </EmptyWrap>
              )}

              {filteredConvs.map((conv) => {
                const other = getOtherPerson(conv);
                const hasUnread = conv.unread_count > 0;
                return (
                  <ConvItem
                    key={conv.id}
                    $active={conv.id === activeId}
                    onClick={() => onSelectConv(conv.id)}
                  >
                    <ConvAvatarWrap>
                      <AvatarWithFallback
                        src={other.avatar}
                        name={other.name}
                        size={44}
                      />
                      {hasUnread && <UnreadDot />}
                    </ConvAvatarWrap>
                    <ConvMeta>
                      <ConvMetaTop>
                        <ConvName $unread={hasUnread}>{other.name}</ConvName>
                        {conv.updated_at && (
                          <ConvTime>
                            {formatSmartDate(conv.updated_at)}
                          </ConvTime>
                        )}
                      </ConvMetaTop>
                      <ConvMetaBottom>
                        <ConvSub>
                          {conv.listings?.title ?? "Listing"} Inquiry
                        </ConvSub>
                        {hasUnread && (
                          <UnreadBadge>{conv.unread_count}</UnreadBadge>
                        )}
                      </ConvMetaBottom>
                    </ConvMeta>
                  </ConvItem>
                );
              })}
            </ConvList>
          </ConvPanel>

          {/* ── Right: Chat panel ── */}
          <ChatPanel $hidden={mobileView === "list"}>
            {activeConversation ? (
              <>
                <ChatHeader>
                  <MobileBackBtn onClick={() => setMobileView("list")}>
                    ←
                  </MobileBackBtn>
                  <AvatarWithFallback
                    src={otherPerson.avatar}
                    name={otherPerson.name}
                    size={38}
                    style={{ border: "2px solid #e4ede4" }}
                  />
                  <ChatHeaderInfo>
                    <ChatHeaderName>{otherPerson.name}</ChatHeaderName>
                    <ChatHeaderSub>
                      {activeConversation.listings?.title ?? "Listing"} Inquiry
                    </ChatHeaderSub>
                  </ChatHeaderInfo>

                  {confirmDeleteId === activeId ? (
                    <ConfirmDeleteRow>
                      <span style={{ fontSize: "0.74rem", color: "#8ea88e" }}>
                        Delete?
                      </span>
                      <ConfirmBtn $danger onClick={onDeleteConversation}>
                        Yes
                      </ConfirmBtn>
                      <ConfirmBtn onClick={() => setConfirmDeleteId(null)}>
                        No
                      </ConfirmBtn>
                    </ConfirmDeleteRow>
                  ) : (
                    <DeleteConvBtn onClick={() => setConfirmDeleteId(activeId)}>
                      <Trash2 size={16} />
                    </DeleteConvBtn>
                  )}
                </ChatHeader>

                <ChatBody>
                  {messages.length === 0 && (
                    <EmptyWrap>
                      <EmptyIcon><MessageCircle size={36} color="#4a7c45" /></EmptyIcon>
                      <EmptyTitle>Say hello to {otherPerson.name}!</EmptyTitle>
                      <EmptyDesc>
                        No messages yet — start the conversation below.
                      </EmptyDesc>
                    </EmptyWrap>
                  )}

                  {messages.map((msg, idx) => {
                    const fromOwner = msg.sender_id === user?.id;
                    const prevMsg = messages[idx - 1];
                    const nextMsg = messages[idx + 1];

                    const grouped =
                      !!prevMsg &&
                      prevMsg.sender_id === msg.sender_id &&
                      new Date(msg.created_at) - new Date(prevMsg.created_at) <
                        GROUPING_MS;

                    const isLast =
                      !nextMsg ||
                      nextMsg.sender_id !== msg.sender_id ||
                      new Date(nextMsg.created_at) - new Date(msg.created_at) >=
                        GROUPING_MS;

                    const showSep =
                      !prevMsg ||
                      new Date(msg.created_at).toDateString() !==
                        new Date(prevMsg.created_at).toDateString();

                    return (
                      <Fragment key={msg.id}>
                        {showSep && (
                          <DateSep>
                            <DateSepLine />
                            <DateSepLabel>
                              {formatDayLabel(msg.created_at)}
                            </DateSepLabel>
                            <DateSepLine />
                          </DateSep>
                        )}
                        <MessageBubble
                          $fromOwner={fromOwner}
                          $grouped={grouped}
                          $isLast={isLast}
                          style={{ marginTop: grouped ? 2 : 8 }}
                        >
                          <BubbleText $fromOwner={fromOwner}>
                            {msg.content}
                          </BubbleText>
                          {/* Timestamp + delete only on the last bubble in a group */}
                          {isLast && (
                            <BubbleMeta>
                              <BubbleTime $fromOwner={fromOwner}>
                                {formatSmartDate(msg.created_at)}
                              </BubbleTime>
                              {fromOwner && (
                                <DeleteMsgBtn
                                  $fromOwner={fromOwner}
                                  onClick={() => deleteMessage(msg.id)}
                                  title="Delete message"
                                >
                                  <X size={16} />
                                </DeleteMsgBtn>
                              )}
                            </BubbleMeta>
                          )}
                        </MessageBubble>
                      </Fragment>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </ChatBody>

                <InputArea onSubmit={onSend}>
                  <MessageInput
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={`Message ${otherPerson.name}…`}
                    autoComplete="off"
                  />
                  <SendBtn type="submit" disabled={!draft.trim() || sending}>
                    {sending ? "…" : "Send"}
                  </SendBtn>
                </InputArea>
              </>
            ) : (
              <EmptyWrap>
                <EmptyIcon><MessageCircle size={36} color="#4a7c45" /></EmptyIcon>
                <EmptyTitle>No conversation selected</EmptyTitle>
                <EmptyDesc>
                  Pick a conversation from the left to start chatting.
                </EmptyDesc>
              </EmptyWrap>
            )}
          </ChatPanel>
        </Layout>
      </Container>
    </>
  );
};

export default Messages;
