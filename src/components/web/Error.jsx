import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Wheat } from "lucide-react";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
`;

function ErrorDisplay() {
  const navigate = useNavigate();
  return (
    <Page>
      <Card>
        <Illustration><Wheat size={64} color="#4a7c45" /></Illustration>
        <Code>404</Code>
        <Title>Page Not Found</Title>
        <Desc>
          Looks like this field hasn't been planted yet. The page you're
          looking for doesn't exist or may have moved.
        </Desc>
        <Actions>
          <PrimaryBtn onClick={() => navigate("/")}>Go to Homepage</PrimaryBtn>
          <SecondaryBtn onClick={() => navigate(-1)}>Go Back</SecondaryBtn>
        </Actions>
        <Suggestions>
          <SuggestLabel>You might be looking for:</SuggestLabel>
          <SuggestLinks>
            <SuggestLink onClick={() => navigate("/mobile")}>Browse Listings</SuggestLink>
            <SuggestLink onClick={() => navigate("/forfarms")}>For Farmers</SuggestLink>
            <SuggestLink onClick={() => navigate("/forbuyers")}>For Buyers</SuggestLink>
            <SuggestLink onClick={() => navigate("/contactus")}>Contact Us</SuggestLink>
          </SuggestLinks>
        </Suggestions>
      </Card>
    </Page>
  );
}

export default ErrorDisplay;

const Page = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const Card = styled.div`
  background: white;
  border-radius: 24px;
  padding: 56px 48px;
  max-width: 480px;
  width: 100%;
  text-align: center;
  box-shadow: 0 8px 40px rgba(20, 57, 32, 0.08);
  animation: ${fadeUp} 0.45s ease;

  @media (max-width: 480px) {
    padding: 40px 28px;
  }
`;

const Illustration = styled.div`
  font-size: 4rem;
  margin-bottom: 8px;
  display: inline-block;
  animation: ${float} 3s ease-in-out infinite;
`;

const Code = styled.p`
  font-size: 5rem;
  font-weight: 900;
  color: #e8f0e8;
  margin: 0 0 4px;
  line-height: 1;
  letter-spacing: -4px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 12px;
`;

const Desc = styled.p`
  color: #7b8f7f;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 32px;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 32px;
`;

const PrimaryBtn = styled.button`
  padding: 12px 28px;
  border-radius: 12px;
  border: none;
  background: #2f5a2a;
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
  &:hover { background: #245026; transform: translateY(-1px); }
`;

const SecondaryBtn = styled.button`
  padding: 12px 28px;
  border-radius: 12px;
  border: 1.5px solid #cde5cf;
  background: white;
  color: #2f5a2a;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: #2f5a2a; background: #f0fdf4; }
`;

const Suggestions = styled.div`
  border-top: 1px solid #f0f5f0;
  padding-top: 24px;
`;

const SuggestLabel = styled.p`
  font-size: 0.8rem;
  color: #aabcaa;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 12px;
`;

const SuggestLinks = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
`;

const SuggestLink = styled.button`
  padding: 6px 14px;
  border-radius: 999px;
  border: 1.5px solid #e0ece0;
  background: white;
  color: #44554c;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: #2f5a2a; color: #2f5a2a; background: #f0fdf4; }
`;
