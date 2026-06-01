import { useState } from "react";
import AppNavbar from "./AppNavbar";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(47,90,42,0.4); }
  60%       { box-shadow: 0 0 0 8px rgba(47,90,42,0); }
`;

const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Honey",
  "Poultry",
  "Grains",
];

export default function AppHome() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) navigate(`/list?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <Container>
      <AppNavbar />

      <MapLayer>
        {/* ── Map ── */}
        <StyledIframe
          title="Farm Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5028.815388190825!2d34.805867768719445!3d-0.15380842781345577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182abd001a9ece4d%3A0xa3711c9f9653759d!2sOmindi%20FarmHouse!5e1!3m2!1sen!2sbh!4v1774555786905!5m2!1sen!2sbh"
          loading="lazy"
        />
        <Overlay />

        {/* ── Search bar ── */}
        <SearchWrap>
          <SearchInner>
            <SearchIconWrap>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </SearchIconWrap>
            <SearchInput
              type="text"
              placeholder="Search farms, produce, or location…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {query && <ClearBtn onClick={() => setQuery("")}>✕</ClearBtn>}
            <SearchBtn onClick={handleSearch}>Search</SearchBtn>
          </SearchInner>

          {/* Category pills */}
        </SearchWrap>

        {/* ── Live badge ── */}
        <LiveBadge>
          <PinDot />1 farm nearby · Kisumu
        </LiveBadge>

        {/* ── Farm card ── */}
        <FarmCard>


          <CardHeader>
            <FarmAvatarWrap>
              <FarmAvatar src="/afarmer.jpg" alt="Omindi FarmHouse" />
            </FarmAvatarWrap>
            <CardHeaderText>
              <FarmName>Omindi FarmHouse</FarmName>
              <FarmSub>Organic Farm &amp; Marketplace</FarmSub>
            </CardHeaderText>
            <RatingBadge>⭐ 4.8</RatingBadge>
          </CardHeader>

          <CardBody>
            <InfoRow>
              <InfoLabel>Location</InfoLabel>
              <InfoValue>Alendu. Kisumu, Kenya</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Products</InfoLabel>
              <InfoValue>Vegetables, Fruits</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Distance</InfoLabel>
              <InfoValue>2.3 km away</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Status</InfoLabel>
              <InfoValue style={{ color: "#16a34a" }}>Open now</InfoValue>
            </InfoRow>
          </CardBody>

          <CardDivider />

          <CardFooter>
            <PrimaryBtn onClick={() => navigate("/list")}>
              Start Shopping
            </PrimaryBtn>
          </CardFooter>
        </FarmCard>
      </MapLayer>
    </Container>
  );
}

// ─── Styled components ────────────────────────────────────────────────────────

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0e1a0e;
`;

const MapLayer = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
`;

const StyledIframe = styled.iframe`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  filter: saturate(0.75) brightness(0.88);
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(14, 26, 14, 0.6) 0%,
    rgba(14, 26, 14, 0.05) 35%,
    rgba(14, 26, 14, 0.05) 55%,
    rgba(14, 26, 14, 0.75) 100%
  );
  pointer-events: none;
  z-index: 1;
`;

/* ── Search ── */
const SearchWrap = styled.div`
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  z-index: 10;
  max-width: 560px;
  animation: ${slideUp} 0.4s ease;

  @media (min-width: 768px) {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    width: 600px;
    max-width: calc(100% - 48px);
  }
`;

const SearchInner = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(14px);
  border-radius: 14px;
  padding: 0 10px 0 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  gap: 8px;
  margin-bottom: 10px;
`;

const SearchIconWrap = styled.div`
  color: #9ca3af;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 13px 0;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #1a2e1a;
  outline: none;
  &::placeholder {
    color: #9ca3af;
    font-size: 14px;
  }
`;

const ClearBtn = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 0.75rem;
  padding: 4px;
  flex-shrink: 0;
  &:hover {
    color: #374151;
  }
`;

const SearchBtn = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 10px;
  background: #2f5a2a;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition:
    background 0.15s,
    transform 0.1s;
  &:hover {
    background: #245026;
    transform: translateY(-1px);
  }
`;

const CategoryRow = styled.div`
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryPill = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 13px;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  font-size: 0.78rem;
  font-weight: 600;
  color: #1a3318;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.15s;
  &:hover {
    background: white;
    transform: translateY(-1px);
  }
`;

/* ── Live badge ── */
const LiveBadge = styled.div`
  position: absolute;
  top: 120px;
  left: 14px;

  @media (min-width: 768px) {
    left: 50%;
    transform: translateX(-50%);
  }
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 0.76rem;
  font-weight: 700;
  color: #2f5a2a;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 7px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  animation: ${slideUp} 0.4s ease 0.15s both;
`;

const PinDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #16a34a;
  flex-shrink: 0;
  animation: ${pulse} 2s infinite;
`;

/* ── Farm card ── */
const FarmCard = styled.div`
  position: absolute;
  right: 14px;
  bottom: 16px;
  width: 290px;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(18px);
  border-radius: 22px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  z-index: 10;
  overflow: hidden;
  animation: ${slideUp} 0.5s ease 0.1s both;

  @media (min-width: 768px) {
    width: 380px;
    bottom: 32px;
    right: 32px;
  }

  @media (min-width: 1200px) {
    width: 440px;
    bottom: 48px;
    right: 48px;
  }

  @media (max-width: 600px) {
    right: 14px;
    left: 14px;
    width: auto;
    bottom: calc(100px + env(safe-area-inset-bottom, 0px));
    max-height: 50vh;
    overflow-y: auto;
  }
`;

const CardAccent = styled.div`
  height: 4px;
  background: linear-gradient(90deg, #2f5a2a, #5c9132, #8bc34a);
`;

const CardHeader = styled.div`
  padding: 14px 16px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #f0f7ee;
`;

const FarmAvatarWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1.5px solid #e8f5e9;
`;
const FarmAvatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const CardHeaderText = styled.div`
  flex: 1;
  min-width: 0;
`;
const FarmName = styled.h2`
  margin: 0 0 2px;
  font-size: 0.95rem;
  font-weight: 800;
  color: #1a2e1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const FarmSub = styled.p`
  margin: 0;
  font-size: 0.7rem;
  font-weight: 600;
  color: #5c9132;
  text-transform: uppercase;
  letter-spacing: 0.07em;
`;
const RatingBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: #92400e;
  background: #fef3c7;
  padding: 3px 8px;
  border-radius: 999px;
  flex-shrink: 0;
`;

const CardBody = styled.div`
  padding: 12px 16px;
  display: grid;
  gap: 7px;
`;
const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
`;
const InfoLabel = styled.span`
  color: #7b9a7b;
`;
const InfoValue = styled.span`
  color: #1a2e1a;
  font-weight: 600;
`;

const CardDivider = styled.div`
  height: 1px;
  background: #f0f7ee;
  margin: 0 14px;
`;

const CardFooter = styled.div`
  padding: 12px 14px;
  padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px));
`;
const PrimaryBtn = styled.button`
  width: 100%;
  padding: 11px;
  border: none;
  border-radius: 11px;
  background: linear-gradient(135deg, #2f5a2a, #4e9643);
  color: white;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    opacity 0.15s,
    transform 0.15s;
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;
