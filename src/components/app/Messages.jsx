import { useState } from "react";
import AppNavbar from "./AppNavbar";
import styled from "styled-components";

const PageContainer = styled.div`
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

const MessagesLayout = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
  margin-top: 20px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ConversationList = styled.div`
  background: white;
  border-radius: 22px;
  box-shadow: 0 12px 30px rgba(34, 79, 38, 0.08);
  overflow: hidden;
`;

const ListHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #ecf2eb;
  h2 {
    margin: 0;
    color: #2f5a2a;
    font-size: 1.2rem;
  }
  p {
    margin: 8px 0 0;
    color: #5b6d57;
    font-size: 0.95rem;
  }
`;

const ConversationItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border: none;
  background: ${({ active }) => (active ? "#eef7ee" : "white")};
  cursor: pointer;
  text-align: left;
  transition: background 0.2s ease;

  &:hover {
    background: #f3faf0;
  }

  img {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    object-fit: cover;
  }

  div {
    flex: 1;
  }

  h3 {
    margin: 0 0 6px;
    font-size: 1rem;
    color: #233a23;
  }

  p {
    margin: 0;
    color: #5b6d57;
    font-size: 0.92rem;
  }
`;

const MessagePanel = styled.div`
  background: white;
  border-radius: 22px;
  box-shadow: 0 12px 30px rgba(34, 79, 38, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #ecf2eb;
  display: flex;
  align-items: center;
  gap: 16px;

  img {
    width: 58px;
    height: 58px;
    object-fit: cover;
    border-radius: 16px;
  }

  div {
    min-width: 0;
  }

  h2 {
    margin: 0;
    color: #233a23;
    font-size: 1.2rem;
  }

  p {
    margin: 6px 0 0;
    color: #5b6d57;
    font-size: 0.92rem;
  }
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 24px 24px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  min-height: 420px;
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 14px 16px;
  border-radius: 22px;
  background: ${({ fromOwner }) => (fromOwner ? "#d7f0d7" : "#f2f6f2")};
  align-self: ${({ fromOwner }) => (fromOwner ? "flex-end" : "flex-start")};
  color: #244423;
  box-shadow: 0 8px 18px rgba(37, 76, 34, 0.08);

  p {
    margin: 0;
    line-height: 1.6;
  }

  span {
    display: block;
    margin-top: 8px;
    color: #5b6d57;
    font-size: 0.82rem;
  }
`;

const InputArea = styled.form`
  padding: 18px 20px 22px;
  border-top: 1px solid #ecf2eb;
  display: flex;
  gap: 12px;
  align-items: center;
  background: #f8fdef;

  input {
    flex: 1;
    border: 1px solid #dbe5d8;
    border-radius: 14px;
    padding: 14px 16px;
    font-size: 1rem;
    color: #243a23;
    background: white;
  }

  button {
    border: none;
    border-radius: 14px;
    background: #2f5a2a;
    color: white;
    padding: 14px 20px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s ease;

    &:hover {
      background: #245026;
    }
  }
`;

const initialConversations = [
  {
    id: 1,
    name: "Amina's Farm",
    role: "Seller",
    avatar: "/farm logo.png",
    latest: "Yes, I can deliver tomorrow morning.",
    unread: 2,
    messages: [
      { id: 1, fromOwner: false, text: "Hello! I need 10kg of spinach.", time: "09:12 AM" },
      { id: 2, fromOwner: true, text: "I have it ready. Would you like delivery?", time: "09:15 AM" },
      { id: 3, fromOwner: false, text: "Yes, please. Pickup at 10AM works.", time: "09:18 AM" },
    ],
  },
  {
    id: 2,
    name: "Market Buyer Group",
    role: "Buyer",
    avatar: "/chat.png",
    latest: "We are confirming the bulk order today.",
    unread: 0,
    messages: [
      { id: 1, fromOwner: true, text: "Can you confirm the quantity for tomatoes?", time: "Yesterday" },
      { id: 2, fromOwner: false, text: "We need 25kg by Friday.", time: "Yesterday" },
    ],
  },
  {
    id: 3,
    name: "Honey Harvest",
    role: "Seller",
    avatar: "/salepic.png",
    latest: "The new batch is ready for inspection.",
    unread: 1,
    messages: [
      { id: 1, fromOwner: false, text: "Your honey order is ready for pickup.", time: "Mon" },
      { id: 2, fromOwner: true, text: "Great, I will collect after 2PM.", time: "Mon" },
    ],
  },
];

const Messages = () => {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState(initialConversations[0].id);
  const [draft, setDraft] = useState("");

  const activeConversation = conversations.find((item) => item.id === activeId);

  const onSend = (event) => {
    event.preventDefault();
    if (!draft.trim() || !activeConversation) return;

    const updatedConversations = conversations.map((conversation) => {
      if (conversation.id !== activeId) return conversation;

      return {
        ...conversation,
        latest: draft,
        unread: 0,
        messages: [
          ...conversation.messages,
          {
            id: conversation.messages.length + 1,
            fromOwner: true,
            text: draft.trim(),
            time: "Now",
          },
        ],
      };
    });

    setConversations(updatedConversations);
    setDraft("");
  };

  return (
    <>
      <AppNavbar />
      <PageContainer>
        <PageTitle>Messages</PageTitle>
        <MessagesLayout>
          <ConversationList>
            <ListHeader>
              <h2>Conversations</h2>
              <p>Chat with sellers and buyers from your network.</p>
            </ListHeader>
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                active={conversation.id === activeId}
                onClick={() => setActiveId(conversation.id)}
              >
                <img src={conversation.avatar} alt={conversation.name} />
                <div>
                  <h3>{conversation.name}</h3>
                  <p>{conversation.latest}</p>
                </div>
                {conversation.unread > 0 && <span>• {conversation.unread}</span>}
              </ConversationItem>
            ))}
          </ConversationList>

          <MessagePanel>
            {activeConversation ? (
              <>
                <ChatHeader>
                  <img src={activeConversation.avatar} alt={activeConversation.name} />
                  <div>
                    <h2>{activeConversation.name}</h2>
                    <p>{activeConversation.role}</p>
                  </div>
                </ChatHeader>
                <ChatBody>
                  {activeConversation.messages.map((message) => (
                    <MessageBubble key={message.id} fromOwner={message.fromOwner}>
                      <p>{message.text}</p>
                      <span>{message.time}</span>
                    </MessageBubble>
                  ))}
                </ChatBody>
                <InputArea onSubmit={onSend}>
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Type your message..."
                  />
                  <button type="submit">Send</button>
                </InputArea>
              </>
            ) : (
              <ListHeader>
                <h2>Select a conversation</h2>
                <p>Tap a seller or buyer to start chatting.</p>
              </ListHeader>
            )}
          </MessagePanel>
        </MessagesLayout>
      </PageContainer>
    </>
  );
};

export default Messages;
