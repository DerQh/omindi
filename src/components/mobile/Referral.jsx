import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { useReferralInfo } from "../../hooks/useReferral";
import { useLoyaltyHistory } from "../../hooks/useLoyalty";
import { Handshake, ShoppingCart, Star, Leaf, Gift, Check, Clipboard } from "lucide-react";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const REWARDS = [
  { Icon: Handshake, label: "Friend signs up with your code", points: "+25 pts (them) +50 pts (you)" },
  { Icon: ShoppingCart, label: "Every order you place", points: "+10 pts" },
  { Icon: Star, label: "Leaving a review", points: "+5 pts" },
  { Icon: Leaf, label: "Creating your first listing", points: "+15 pts" },
];

export default function Referral() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: info, isLoading } = useReferralInfo(user?.id);
  const { data: history = [] }    = useLoyaltyHistory(user?.id);

  const [copied, setCopied] = useState(false);

  const referralLink = info?.referral_code
    ? `${window.location.origin}/sign-up?ref=${info.referral_code}`
    : "";

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleWhatsApp = () => {
    if (!referralLink) return;
    const text = `Join me on AFARMER™ — Kenya's farm marketplace. Use my referral link to sign up and we both get bonus points!\n${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  return (
    <>
      <AppNavbar />
      <Page>
        <Header>
          <BackBtn onClick={() => navigate(-1)}>←</BackBtn>
          <HeaderTitle>Invite Friends</HeaderTitle>
          <div style={{ width: 36 }} />
        </Header>

        <Body>
          {/* Hero */}
          <HeroCard>
            <HeroEmoji><Gift size={40} color="#4a7c45" /></HeroEmoji>
            <HeroTitle>Earn points together</HeroTitle>
            <HeroSub>
              Share your referral link. When a friend joins, you both earn bonus points redeemable on future orders.
            </HeroSub>
            <PointsBadge>
              {isLoading ? "…" : (info?.loyalty_points ?? 0).toLocaleString()} pts
              <span style={{ fontWeight: 500, fontSize: "0.75rem" }}> balance</span>
            </PointsBadge>
          </HeroCard>

          {/* Referral code + share */}
          <Card>
            <CardLabel>Your referral link</CardLabel>
            <CodeBox>
              <CodeText>{info?.referral_code ? referralLink : "Loading…"}</CodeText>
              <CopyBtn onClick={handleCopy} $copied={copied}>
                {copied ? <><Check size={13} style={{marginRight:3}} />Copied!</> : "Copy"}
              </CopyBtn>
            </CodeBox>
            <CodeNote>
              Code: <strong>{info?.referral_code ?? "—"}</strong>
            </CodeNote>

            <ShareRow>
              <ShareBtn $green onClick={handleWhatsApp}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Share on WhatsApp
              </ShareBtn>
              <ShareBtn onClick={handleCopy}>
                {copied ? <><Check size={13} style={{marginRight:3}} />Link Copied!</> : <><Clipboard size={14} style={{marginRight:4}} />Copy Link</>}
              </ShareBtn>
            </ShareRow>
          </Card>

          {/* Stats */}
          <StatsRow>
            <StatBox>
              <StatNum>{info?.referral_count ?? 0}</StatNum>
              <StatLbl>Friends Referred</StatLbl>
            </StatBox>
            <StatBox>
              <StatNum>{isLoading ? "…" : (info?.loyalty_points ?? 0).toLocaleString()}</StatNum>
              <StatLbl>Total Points</StatLbl>
            </StatBox>
          </StatsRow>

          {/* How it works */}
          <Card>
            <CardLabel>How you earn points</CardLabel>
            {REWARDS.map((r) => (
              <RewardRow key={r.label}>
                <RewardIcon><r.Icon size={20} color="#4a7c45" /></RewardIcon>
                <RewardText>
                  <RewardLabel>{r.label}</RewardLabel>
                  <RewardPts>{r.points}</RewardPts>
                </RewardText>
              </RewardRow>
            ))}
          </Card>

          {/* Points history */}
          {history.length > 0 && (
            <Card>
              <CardLabel>Points History</CardLabel>
              {history.slice(0, 10).map((e) => (
                <HistoryRow key={e.id}>
                  <HistoryReason>{e.reason}</HistoryReason>
                  <HistoryPoints $positive={e.points > 0}>
                    {e.points > 0 ? "+" : ""}{e.points} pts
                  </HistoryPoints>
                </HistoryRow>
              ))}
            </Card>
          )}
        </Body>
      </Page>
    </>
  );
}

// ─── Styled components ────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
  padding-bottom: 60px;
`;

const Header = styled.div`
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
  box-shadow: 0 1px 8px rgba(20,57,32,0.06);
`;

const BackBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  background: white;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a3318;
  transition: background 0.15s;
  &:hover { background: #f0fdf4; }
`;

const HeaderTitle = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 1rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0;
`;

const Body = styled.div`
  max-width: 540px;
  margin: 0 auto;
  padding: 20px 16px 40px;
  animation: ${fadeUp} 0.35s ease;
`;

const HeroCard = styled.div`
  background: linear-gradient(135deg, #1e3d1a 0%, #2f5a2a 100%);
  border-radius: 20px;
  padding: 28px 24px;
  text-align: center;
  margin-bottom: 14px;
  color: white;
`;

const HeroEmoji = styled.div`font-size: 2.4rem; margin-bottom: 10px;`;
const HeroTitle = styled.h2`margin: 0 0 8px; font-size: 1.3rem; font-weight: 800; letter-spacing: -0.3px;`;
const HeroSub = styled.p`margin: 0 0 18px; font-size: 0.88rem; color: rgba(255,255,255,0.7); line-height: 1.65;`;

const PointsBadge = styled.div`
  display: inline-block;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 999px;
  padding: 8px 22px;
  font-size: 1.3rem;
  font-weight: 900;
  color: white;
  letter-spacing: -0.5px;
`;

const Card = styled.div`
  background: white;
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 14px;
  box-shadow: 0 2px 12px rgba(20,57,32,0.06);
  border: 1px solid #e8f5e9;
`;

const CardLabel = styled.p`
  margin: 0 0 14px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #7b8f7f;
`;

const CodeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f5f8f5;
  border: 1.5px solid #d7edd9;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 8px;
`;

const CodeText = styled.p`
  flex: 1;
  margin: 0;
  font-size: 0.78rem;
  color: #556652;
  word-break: break-all;
  font-family: monospace;
`;

const CopyBtn = styled.button`
  background: ${({ $copied }) => ($copied ? "#eef7ee" : "#2f5a2a")};
  color: ${({ $copied }) => ($copied ? "#2f5a2a" : "white")};
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
`;

const CodeNote = styled.p`
  margin: 0 0 16px;
  font-size: 0.8rem;
  color: #7b8f7f;
`;

const ShareRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ShareBtn = styled.button`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 11px 18px;
  border-radius: 11px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  background: ${({ $green }) => ($green ? "#25d366" : "#eef7ee")};
  color: ${({ $green }) => ($green ? "white" : "#2f5a2a")};
  transition: opacity 0.15s;
  &:hover { opacity: 0.88; }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 14px;
`;

const StatBox = styled.div`
  background: white;
  border-radius: 16px;
  padding: 18px 20px;
  text-align: center;
  border: 1px solid #e8f5e9;
  box-shadow: 0 2px 10px rgba(20,57,32,0.05);
`;

const StatNum = styled.p`
  margin: 0 0 4px;
  font-size: 2rem;
  font-weight: 900;
  color: #2f5a2a;
  letter-spacing: -1px;
`;

const StatLbl = styled.p`
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #7b8f7f;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const RewardRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f7ee;
  &:last-child { border-bottom: none; }
`;

const RewardIcon = styled.div`font-size: 1.2rem;`;
const RewardText = styled.div`flex: 1;`;
const RewardLabel = styled.p`margin: 0 0 2px; font-size: 0.87rem; font-weight: 600; color: #1a2e1a;`;
const RewardPts = styled.p`margin: 0; font-size: 0.78rem; color: #2f5a2a; font-weight: 700;`;

const HistoryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 0;
  border-bottom: 1px solid #f0f7ee;
  &:last-child { border-bottom: none; }
`;

const HistoryReason = styled.p`margin: 0; font-size: 0.85rem; color: #556652;`;
const HistoryPoints = styled.p`
  margin: 0;
  font-size: 0.88rem;
  font-weight: 700;
  color: ${({ $positive }) => ($positive ? "#2f5a2a" : "#a32d2d")};
`;
