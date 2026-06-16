import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../context/AuthContext";
import {
  useRecurringOrders,
  useToggleRecurringOrder,
  useDeleteRecurringOrder,
} from "../../hooks/useRecurringOrders";
import { formatSmartDate } from "../../hooks/dateFormat";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const FREQ_LABELS = { weekly: "Every week", biweekly: "Every 2 weeks", monthly: "Every month" };

export default function RecurringOrders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: orders = [], isLoading } = useRecurringOrders(user?.id);
  const { mutate: toggle, isPending: toggling } = useToggleRecurringOrder();
  const { mutate: remove, isPending: removing } = useDeleteRecurringOrder();

  const active   = orders.filter((o) => o.active);
  const paused   = orders.filter((o) => !o.active);

  return (
    <>
      <AppNavbar />
      <Page>
        <Header>
          <BackBtn onClick={() => navigate(-1)}>←</BackBtn>
          <HeaderTitle>Recurring Orders</HeaderTitle>
          <div style={{ width: 36 }} />
        </Header>

        <Body>
          <Intro>
            <IntroIcon>🔄</IntroIcon>
            <IntroText>
              Set up weekly, bi-weekly, or monthly orders from your favourite sellers.
              You'll be reminded when the next order is due.
            </IntroText>
          </Intro>

          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard style={{ opacity: 0.6 }} />
            </>
          ) : orders.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📦</EmptyIcon>
              <EmptyTitle>No recurring orders yet</EmptyTitle>
              <EmptyDesc>
                Browse listings and tap "Set Recurring Order" on any listing to get started.
              </EmptyDesc>
              <EmptyBtn onClick={() => navigate("/list")}>Browse Listings →</EmptyBtn>
            </EmptyState>
          ) : (
            <>
              {active.length > 0 && (
                <>
                  <SectionLabel>Active ({active.length})</SectionLabel>
                  {active.map((order) => (
                    <OrderCard key={order.id}>
                      <OrderImg
                        src={order.listings?.image_url || "/afarmer.webp"}
                        alt={order.listings?.title}
                        onError={(e) => { e.target.src = "/afarmer.webp"; }}
                      />
                      <OrderInfo>
                        <OrderTitle
                          onClick={() => navigate(`/listing/${order.listing_id}`, { state: { listing: order.listings } })}
                        >
                          {order.listings?.title || "Unknown listing"}
                        </OrderTitle>
                        <OrderMeta>
                          {FREQ_LABELS[order.frequency]} · Qty {order.quantity} {order.listings?.unit}
                        </OrderMeta>
                        <OrderMeta>
                          By {order.listings?.seller_name}
                        </OrderMeta>
                        <NextOrderRow>
                          <NextBadge>
                            Next: {order.next_order_date
                              ? new Date(order.next_order_date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })
                              : "—"}
                          </NextBadge>
                        </NextOrderRow>
                      </OrderInfo>
                      <OrderActions>
                        <ActionBtn
                          onClick={() => toggle({ id: order.id, active: false, user_id: user.id })}
                          disabled={toggling}
                          title="Pause"
                        >
                          ⏸
                        </ActionBtn>
                        <ActionBtn
                          $danger
                          onClick={() => {
                            if (window.confirm("Delete this recurring order?"))
                              remove({ id: order.id, user_id: user.id });
                          }}
                          disabled={removing}
                          title="Delete"
                        >
                          ✕
                        </ActionBtn>
                      </OrderActions>
                    </OrderCard>
                  ))}
                </>
              )}

              {paused.length > 0 && (
                <>
                  <SectionLabel style={{ marginTop: 20 }}>Paused ({paused.length})</SectionLabel>
                  {paused.map((order) => (
                    <OrderCard key={order.id} $paused>
                      <OrderImg
                        src={order.listings?.image_url || "/afarmer.webp"}
                        alt={order.listings?.title}
                        onError={(e) => { e.target.src = "/afarmer.webp"; }}
                        style={{ opacity: 0.5 }}
                      />
                      <OrderInfo>
                        <OrderTitle>{order.listings?.title || "Unknown listing"}</OrderTitle>
                        <OrderMeta>{FREQ_LABELS[order.frequency]} · Qty {order.quantity}</OrderMeta>
                        <PausedBadge>Paused</PausedBadge>
                      </OrderInfo>
                      <OrderActions>
                        <ActionBtn
                          $green
                          onClick={() => toggle({ id: order.id, active: true, user_id: user.id })}
                          disabled={toggling}
                          title="Resume"
                        >
                          ▶
                        </ActionBtn>
                        <ActionBtn
                          $danger
                          onClick={() => {
                            if (window.confirm("Delete this recurring order?"))
                              remove({ id: order.id, user_id: user.id });
                          }}
                          disabled={removing}
                        >
                          ✕
                        </ActionBtn>
                      </OrderActions>
                    </OrderCard>
                  ))}
                </>
              )}
            </>
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
  width: 36px; height: 36px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  background: white;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #1a3318;
  transition: background 0.15s;
  &:hover { background: #f0fdf4; }
`;

const HeaderTitle = styled.h1`
  flex: 1; text-align: center;
  font-size: 1rem; font-weight: 800; color: #1a3318; margin: 0;
`;

const Body = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 16px 40px;
  animation: ${fadeUp} 0.35s ease;
`;

const Intro = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #eef7ee;
  border: 1px solid #cde5cf;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 20px;
`;

const IntroIcon = styled.div`font-size: 1.4rem;`;
const IntroText = styled.p`margin: 0; font-size: 0.85rem; color: #556652; line-height: 1.65;`;

const SectionLabel = styled.p`
  margin: 0 0 10px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #7b8f7f;
`;

const OrderCard = styled.div`
  background: ${({ $paused }) => ($paused ? "#fafbfa" : "white")};
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 10px rgba(20,57,32,0.06);
  border: 1.5px solid ${({ $paused }) => ($paused ? "#e8f0e8" : "#d7edd9")};
  animation: ${fadeUp} 0.3s ease;
`;

const OrderImg = styled.img`
  width: 64px; height: 64px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
`;

const OrderInfo = styled.div`flex: 1;`;
const OrderTitle = styled.p`
  margin: 0 0 3px;
  font-size: 0.92rem;
  font-weight: 700;
  color: #1a2e1a;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;
const OrderMeta = styled.p`margin: 0 0 2px; font-size: 0.77rem; color: #7b8f7f;`;

const NextOrderRow = styled.div`margin-top: 5px;`;
const NextBadge = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  background: #eef7ee;
  color: #2f5a2a;
`;

const PausedBadge = styled.span`
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  background: #fdf0f0;
  color: #a32d2d;
  margin-top: 4px;
`;

const OrderActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
`;

const ActionBtn = styled.button`
  width: 34px; height: 34px;
  border-radius: 9px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex; align-items: center; justify-content: center;
  background: ${({ $danger, $green }) => $danger ? "#fdf0f0" : $green ? "#eef7ee" : "#f5f8f5"};
  color: ${({ $danger, $green }) => $danger ? "#a32d2d" : $green ? "#2f5a2a" : "#7b8f7f"};
  transition: opacity 0.15s;
  &:hover { opacity: 0.75; }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
`;

const SkeletonCard = styled.div`
  height: 88px;
  border-radius: 16px;
  background: linear-gradient(90deg, #e8f0e8 25%, #f3f7f3 50%, #e8f0e8 75%);
  background-size: 800px 100%;
  margin-bottom: 10px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 20px;
  background: white;
  border-radius: 20px;
  border: 1.5px solid #e8f5e9;
`;

const EmptyIcon = styled.div`font-size: 2.2rem; margin-bottom: 12px;`;
const EmptyTitle = styled.p`margin: 0 0 8px; font-size: 1rem; font-weight: 800; color: #1a2e1a;`;
const EmptyDesc = styled.p`margin: 0 0 20px; font-size: 0.85rem; color: #7b8f7f; line-height: 1.6;`;
const EmptyBtn = styled.button`
  background: #2f5a2a; color: white; border: none;
  padding: 11px 24px; border-radius: 11px;
  font-size: 0.88rem; font-weight: 700; cursor: pointer;
  &:hover { background: #1e3d1a; }
`;
