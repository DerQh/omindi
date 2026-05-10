import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  background: #f7fbff;
  padding: 20px 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  max-width: 900px;
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

const Card = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(20, 57, 32, 0.08);
  overflow: hidden;
`;

const Content = styled.div`
  padding: 32px;
`;

const ProductName = styled.h2`
  margin: 0 0 8px;
  color: #2f5a2a;
  font-size: 2rem;
`;

const Meta = styled.p`
  margin: 0 0 24px;
  color: #7b8f7f;
  font-size: 1rem;
`;

const FieldLabel = styled.label`
  display: block;
  font-weight: 700;
  margin-bottom: 8px;
  color: #2f5a2a;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: 2px solid #d7e9ff;
  border-radius: 14px;
  background: #f7fbff;
  color: #2f5a2a;
  font-size: 1rem;
  margin-bottom: 20px;
  outline: none;

  &:focus {
    border-color: #2f5a2a;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 160px;
  padding: 16px;
  border: 2px solid #d7e9ff;
  border-radius: 14px;
  background: #f7fbff;
  color: #2f5a2a;
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 20px;
  outline: none;

  &:focus {
    border-color: #2f5a2a;
  }
`;

const Footer = styled.div`
  display: grid;
  gap: 16px;
`;

const SendButton = styled.button`
  background-color: #2f5a2a;
  color: white;
  border: none;
  padding: 18px 24px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #245026;
    box-shadow: 0 4px 12px rgba(47, 90, 42, 0.3);
  }
`;

const CancelButton = styled.button`
  background-color: #e5f4ff;
  color: #2f5a2a;
  border: 2px solid #2f5a2a;
  padding: 18px 24px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d7e9ff;
  }
`;

const Confirmation = styled.div`
  background: #eef9f0;
  border: 1px solid #cde5cf;
  border-radius: 14px;
  padding: 22px;
  margin-top: 24px;
  color: #2f5a2a;
  font-size: 1rem;
`;

const Inquiry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const listing = location.state?.listing;
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
  };

  const handleContinue = () => {
    navigate("/mobile");
  };

  if (!listing) {
    return (
      <Container>
        <AppNavbar />
        <Header>
          <BackButton onClick={handleBack}>←</BackButton>
          <Title>Inquiry unavailable</Title>
        </Header>
        <Card>
          <Content>
            <Meta>
              No listing details were found. Please return to the listing and
              try again.
            </Meta>
            <CancelButton onClick={handleContinue}>
              Back to marketplace
            </CancelButton>
          </Content>
        </Card>
      </Container>
    );
  }

  return (
    <>
      <AppNavbar />
      <Container>
        <Header>
          <BackButton onClick={handleBack}>←</BackButton>
          <Title>Send Inquiry</Title>
        </Header>

        <Card>
          <Content>
            <ProductName>{listing.name}</ProductName>
            <Meta>Seller: {listing.seller.name}</Meta>
            <Meta>Location: {listing.location}</Meta>
            <Meta>Minimum order: {listing.minOrder}</Meta>

            <FieldLabel htmlFor="inquiry-message">Your message</FieldLabel>
            <TextArea
              id="inquiry-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={`Hi ${listing.seller.name}, I'm interested in your ${listing.name}. Please let me know availability and pickup details.`}
            />

            <Footer>
              <SendButton onClick={handleSend}>Send Inquiry</SendButton>
              <CancelButton onClick={handleBack}>Cancel</CancelButton>
            </Footer>

            {sent && (
              <Confirmation>
                <strong>Inquiry sent!</strong> The seller will receive your
                message and reach out with next steps. You can continue browsing
                or return to messages.
                <div style={{ marginTop: "16px" }}>
                  <SendButton onClick={handleContinue}>
                    Continue browsing
                  </SendButton>
                </div>
              </Confirmation>
            )}
          </Content>
        </Card>
      </Container>
    </>
  );
};

export default Inquiry;
