import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes } from "styled-components";
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

// ─── Animations ───────────────────────────────────────────────────────────────

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
`;

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
`;

// ─── Page Shell ───────────────────────────────────────────────────────────────

const Container = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
  padding-bottom: 40px;
`;

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero = styled.div`
  padding: 28px 24px 38px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    top: -70px;
    right: -40px;
    pointer-events: none;
  }
`;


// ─── Layout ───────────────────────────────────────────────────────────────────

const Layout = styled.div`
  max-width: 960px;
  margin: -32px auto 0;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 16px;
  position: relative;
  z-index: 5;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

// ─── Conversation Panel ───────────────────────────────────────────────────────

// On mobile, hide this panel when a chat is open
const ConvPanel = styled.div`
  background: white;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 680px;

  @media (max-width: 860px) {
    display: ${({ $hidden }) => ($hidden ? "none" : "flex")};
  }
`;

const ConvPanelHeader = styled.div`
  padding: 16px 18px 12px;
  border-bottom: 1px solid #f0f7ee;
`;

const ConvPanelTitle = styled.h2`
  margin: 0 0 10px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a3318;
`;

// Search input to filter conversations by contact name
const SearchInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1.5px solid #e0ece0;
  border-radius: 10px;
  padding: 9px 14px;
  font-size: 16px;
  color: #1a3318;
  background: #f5f8f5;
  outline: none;
  font-family: inherit;

  &::placeholder {
    color: #aac4aa;
  }
  &:focus {
    border-color: #2f5a2a;
    background: white;
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
  gap: 12px;
  padding: 13px 16px;
  border: none;
  background: ${({ $active }) => ($active ? "#eef7ee" : "white")};
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
  border-bottom: 1px solid #f0f7ee;
  position: relative;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #f3faf0;
  }
`;

const ConvAvatar = styled.div`
  position: relative;
  flex-shrink: 0;

  img {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    object-fit: cover;
    background: #d7edd9;
    display: block;
  }
`;

// Green dot shown when unread_count > 0
const UnreadDot = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #2f5a2a;
  border: 2px solid white;
`;

const UnreadBadge = styled.span`
  background: #2f5a2a;
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  flex-shrink: 0;
`;

const ConvMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

const ConvName = styled.p`
  margin: 0 0 3px;
  font-size: 0.9rem;
  font-weight: ${({ $unread }) => ($unread ? "700" : "600")};
  color: #1a3318;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ConvSub = styled.p`
  margin: 0;
  color: #7b8f7f;
  font-size: 0.78rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ConvTime = styled.span`
  font-size: 0.72rem;
  color: #aac4aa;
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 2px;
`;

// ─── Chat Panel ───────────────────────────────────────────────────────────────

// On mobile, hide when viewing the conversation list
const ChatPanel = styled.div`
  background: white;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 680px;
  animation: ${popIn} 0.25s ease;

  @media (max-width: 860px) {
    display: ${({ $hidden }) => ($hidden ? "none" : "flex")};
  }
`;

const ChatHeader = styled.div`
  padding: 14px 18px;
  border-bottom: 1px solid #f0f7ee;
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
`;

// Mobile back button — visible only on small screens
const MobileBackBtn = styled.button`
  display: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.5px solid #e0ece0;
  background: none;
  color: #2f5a2a;
  font-size: 1rem;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: 860px) {
    display: flex;
  }
`;

const ChatHeaderAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: #d7edd9;
  flex-shrink: 0;
`;

const ChatHeaderInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChatHeaderName = styled.p`
  margin: 0 0 2px;
  font-size: 0.93rem;
  font-weight: 700;
  color: #1a3318;
`;

const ChatHeaderSub = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: #7b8f7f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Delete conversation button — shows confirm prompt inline on first click
const DeleteConvBtn = styled.button`
  background: none;
  border: none;
  font-size: 0.85rem;
  cursor: pointer;
  color: #aac4aa;
  padding: 6px 10px;
  border-radius: 8px;
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover {
    background: #fdf0f0;
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
  font-size: 0.75rem;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  background: ${({ $danger }) => ($danger ? "#fdf0f0" : "#f0f7ee")};
  color: ${({ $danger }) => ($danger ? "#a32d2d" : "#2f5a2a")};
  &:hover {
    opacity: 0.8;
  }
`;

// ─── Chat Body ────────────────────────────────────────────────────────────────

const ChatBody = styled.div`
  flex: 1;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  min-height: 340px;
  scrollbar-width: thin;
  scrollbar-color: #d7edd9 transparent;
`;

const MessageBubble = styled.div`
  max-width: 72%;
  padding: 10px 14px;
  border-radius: ${({ $fromOwner }) =>
    $fromOwner ? "18px 18px 4px 18px" : "18px 18px 18px 4px"};
  background: ${({ $fromOwner }) => ($fromOwner ? "#2f5a2a" : "#f0f7ee")};
  align-self: ${({ $fromOwner }) => ($fromOwner ? "flex-end" : "flex-start")};
  animation: ${slideUp} 0.2s ease;
`;

const BubbleText = styled.p`
  margin: 0 0 4px;
  line-height: 1.55;
  font-size: 0.9rem;
  color: ${({ $fromOwner }) => ($fromOwner ? "white" : "#1a3318")};
`;

const BubbleMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

const BubbleTime = styled.span`
  font-size: 0.7rem;
  color: ${({ $fromOwner }) =>
    $fromOwner ? "rgba(255,255,255,0.6)" : "#aac4aa"};
`;

// Small ✕ button to delete own messages
const DeleteMsgBtn = styled.button`
  background: none;
  border: none;
  font-size: 0.65rem;
  color: ${({ $fromOwner }) =>
    $fromOwner ? "rgba(255,255,255,0.5)" : "#aac4aa"};
  cursor: pointer;
  padding: 0;
  line-height: 1;

  &:hover {
    color: ${({ $fromOwner }) =>
      $fromOwner ? "rgba(255,255,255,0.9)" : "#a32d2d"};
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
  gap: 8px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 2.2rem;
`;

const EmptyTitle = styled.p`
  margin: 0 0 4px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a3318;
`;

const EmptyDesc = styled.p`
  margin: 0;
  font-size: 0.82rem;
  color: #7b8f7f;
`;

// ─── Input Area ───────────────────────────────────────────────────────────────

const InputArea = styled.form`
  padding: 12px 16px;
  border-top: 1px solid #f0f7ee;
  display: flex;
  gap: 10px;
  align-items: center;
  background: #f8fdf8;
`;

const MessageInput = styled.input`
  flex: 1;
  border: 1.5px solid #e0ece0;
  border-radius: 12px;
  padding: 11px 16px;
  font-size: 16px;
  color: #1a3318;
  background: white;
  outline: none;
  font-family: inherit;

  &::placeholder {
    color: #aac4aa;
  }
  &:focus {
    border-color: #2f5a2a;
  }
`;

const SendBtn = styled.button`
  border: none;
  border-radius: 12px;
  background: #2f5a2a;
  color: white;
  padding: 11px 20px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  transition: background 0.15s;
  white-space: nowrap;

  &:hover {
    background: #245026;
  }
  &:disabled {
    background: #9db79b;
    cursor: not-allowed;
  }
`;

// ─── Loading Skeletons ────────────────────────────────────────────────────────

const SkeletonBase = styled.div`
  border-radius: 8px;
  background: linear-gradient(90deg, #e8f0e8 25%, #f0f7f0 50%, #e8f0e8 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite;
`;

const SkeletonConvItem = () => (
  <div
    style={{
      display: "flex",
      gap: 12,
      padding: "13px 16px",
      borderBottom: "1px solid #f0f7ee",
    }}
  >
    <SkeletonBase
      style={{ width: 46, height: 46, borderRadius: "50%", flexShrink: 0 }}
    />
    <div style={{ flex: 1, display: "grid", gap: 8 }}>
      <SkeletonBase style={{ height: 12, width: "55%" }} />
      <SkeletonBase style={{ height: 10, width: "80%" }} />
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

  // Controls inline delete confirmation — replaces window.confirm
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Mobile: show 'list' or 'chat' panel (full-width toggle below 860px)
  const [mobileView, setMobileView] = useState("list");

  // Ref to scroll chat to the bottom when new messages arrive
  const messagesEndRef = useRef(null);

  // Set active conversation from navigation state (e.g. from Notifications "Reply →")
  // or default to the first conversation
  useEffect(() => {
    if (state?.conversationId) {
      setActiveId(state.conversationId);
      setMobileView("chat");
    } else if (conversations.length > 0 && !activeId) {
      setActiveId(conversations[0]?.id);
    }
  }, [conversations, state]);

  // Mark conversation as read whenever it's opened
  useEffect(() => {
    if (activeId && user?.id) {
      markRead({ conversation_id: activeId, user_id: user?.id });
    }
  }, [activeId]);

  // Auto-scroll to the newest message whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeConversation = conversations.find((c) => c.id === activeId);

  // Returns the other participant's name and avatar
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

  // Filter conversations by the search term against the other person's name
  const filteredConvs = conversations.filter((c) => {
    const { name } = getOtherPerson(c);
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const unreadTotal = conversations.filter((c) => c.unread_count > 0).length;
  const otherPerson = getOtherPerson(activeConversation);

  return (
    <>
      <AppNavbar />
      <Container>
        {/* ── Hero ── */}
        <Hero></Hero>

        <Layout>
          {/* ── Left: Conversation list ── */}
          <ConvPanel $hidden={mobileView === "chat"}>
            <ConvPanelHeader>
              <ConvPanelTitle>
                {conversations.length} conversation
                {conversations.length !== 1 ? "s" : ""}
              </ConvPanelTitle>
              <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name…"
              />
            </ConvPanelHeader>

            <ConvList>
              {/* Loading skeletons */}
              {isLoading && (
                <>
                  <SkeletonConvItem />
                  <SkeletonConvItem />
                  <SkeletonConvItem />
                </>
              )}

              {/* Empty state */}
              {!isLoading && filteredConvs.length === 0 && (
                <EmptyWrap>
                  <EmptyIcon>💬</EmptyIcon>
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

              {/* Conversation rows */}
              {filteredConvs.map((conv) => {
                const other = getOtherPerson(conv);
                const hasUnread = conv.unread_count > 0;
                return (
                  <ConvItem
                    key={conv.id}
                    $active={conv.id === activeId}
                    onClick={() => onSelectConv(conv.id)}
                  >
                    <ConvAvatar>
                      <img src={other.avatar} alt={other.name} />
                      {hasUnread && <UnreadDot />}
                    </ConvAvatar>
                    <ConvMeta>
                      <ConvName $unread={hasUnread}>{other.name}</ConvName>
                      <ConvSub>
                        {conv.listings?.title ?? "Listing"} Inquiry
                      </ConvSub>
                    </ConvMeta>
                    {hasUnread && (
                      <UnreadBadge>{conv.unread_count}</UnreadBadge>
                    )}
                    {conv.updated_at && (
                      <ConvTime>{formatSmartDate(conv.updated_at)}</ConvTime>
                    )}
                  </ConvItem>
                );
              })}
            </ConvList>
          </ConvPanel>

          {/* ── Right: Chat panel ── */}
          <ChatPanel $hidden={mobileView === "list"}>
            {activeConversation ? (
              <>
                {/* Chat header */}
                <ChatHeader>
                  <MobileBackBtn onClick={() => setMobileView("list")}>
                    ←
                  </MobileBackBtn>
                  <ChatHeaderAvatar
                    src={otherPerson.avatar}
                    alt={otherPerson.name}
                  />
                  <ChatHeaderInfo>
                    <ChatHeaderName>{otherPerson.name}</ChatHeaderName>
                    <ChatHeaderSub>
                      {activeConversation.listings?.title ?? "Listing"} Inquiry
                    </ChatHeaderSub>
                  </ChatHeaderInfo>

                  {/* Inline delete confirmation — avoids window.confirm */}
                  {confirmDeleteId === activeId ? (
                    <ConfirmDeleteRow>
                      <span style={{ fontSize: "0.75rem", color: "#7b8f7f" }}>
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
                      🗑
                    </DeleteConvBtn>
                  )}
                </ChatHeader>

                {/* Messages */}
                <ChatBody>
                  {messages.length === 0 && (
                    <EmptyWrap>
                      <EmptyIcon>👋</EmptyIcon>
                      <EmptyTitle>Say hello to {otherPerson.name}!</EmptyTitle>
                      <EmptyDesc>
                        No messages yet — start the conversation below.
                      </EmptyDesc>
                    </EmptyWrap>
                  )}

                  {messages.map((msg) => {
                    const fromOwner = msg.sender_id === user?.id;
                    return (
                      <MessageBubble key={msg.id} $fromOwner={fromOwner}>
                        <BubbleText $fromOwner={fromOwner}>
                          {msg.content}
                        </BubbleText>
                        <BubbleMeta>
                          <BubbleTime $fromOwner={fromOwner}>
                            {formatSmartDate(msg.created_at)}
                          </BubbleTime>
                          {/* Only show delete on own messages */}
                          {fromOwner && (
                            <DeleteMsgBtn
                              $fromOwner={fromOwner}
                              onClick={() => deleteMessage(msg.id)}
                              title="Delete message"
                            >
                              ✕
                            </DeleteMsgBtn>
                          )}
                        </BubbleMeta>
                      </MessageBubble>
                    );
                  })}
                  {/* Invisible anchor to scroll to */}
                  <div ref={messagesEndRef} />
                </ChatBody>

                {/* Input */}
                <InputArea onSubmit={onSend}>
                  <MessageInput
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={`Message ${otherPerson.name}…`}
                    autoComplete="off"
                  />
                  <SendBtn type="submit" disabled={!draft.trim() || sending}>
                    {sending ? "…" : "Send →"}
                  </SendBtn>
                </InputArea>
              </>
            ) : (
              <EmptyWrap>
                <EmptyIcon>💬</EmptyIcon>
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
