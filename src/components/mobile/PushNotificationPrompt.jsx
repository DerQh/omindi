import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Bell, X, Check } from "lucide-react";

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// Shows a native push-notification permission prompt.
// Renders only when:
//   1. The browser supports notifications
//   2. Permission is not yet granted or denied
//   3. The user hasn't dismissed the banner in this session
export default function PushNotificationPrompt() {
  const [show, setShow]           = useState(false);
  const [status, setStatus]       = useState("idle"); // idle | requesting | granted | denied | unsupported

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setStatus("unsupported");
      return;
    }
    const perm = Notification.permission;
    if (perm === "granted" || perm === "denied") return;
    // Only show the banner once per session
    const dismissed = sessionStorage.getItem("push_prompt_dismissed");
    if (dismissed) return;
    // Delay slightly so it doesn't appear immediately on page load
    const t = setTimeout(() => setShow(true), 3500);
    return () => clearTimeout(t);
  }, []);

  const handleEnable = async () => {
    setStatus("requesting");
    try {
      const permission = await Notification.requestPermission();
      setStatus(permission);
      if (permission === "granted") {
        // Service worker is already registered by Vite PWA plugin.
        // After granting, subscribe to push here or via Supabase Edge Function.
        // For now, just confirm and close.
        setTimeout(() => setShow(false), 2200);
      } else {
        setTimeout(() => setShow(false), 1800);
      }
    } catch {
      setStatus("denied");
      setTimeout(() => setShow(false), 1800);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem("push_prompt_dismissed", "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <Banner>
      <BannerIcon><Bell size={24} color="#4a7c45" /></BannerIcon>
      <BannerContent>
        <BannerTitle>Stay in the loop</BannerTitle>
        <BannerDesc>
          {status === "requesting"
            ? "Waiting for your permission…"
            : status === "granted"
            ? <><Check size={13} style={{marginRight:3}} />Notifications enabled!</>
            : status === "denied"
            ? "You can enable notifications in browser settings."
            : "Get instant alerts for orders, messages, and price drops."}
        </BannerDesc>
      </BannerContent>
      <BannerActions>
        {status === "idle" && (
          <>
            <EnableBtn onClick={handleEnable}>Enable</EnableBtn>
            <DismissBtn onClick={handleDismiss}>Not now</DismissBtn>
          </>
        )}
        {status === "requesting" && <Spinner />}
        {(status === "granted" || status === "denied") && (
          <DismissBtn onClick={() => setShow(false)}><X size={16} /></DismissBtn>
        )}
      </BannerActions>
    </Banner>
  );
}

// ─── Styled components ────────────────────────────────────────────────────────

const Banner = styled.div`
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 480px;
  background: white;
  border-radius: 18px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 0 0 1.5px #d7edd9;
  z-index: 999;
  animation: ${slideUp} 0.35s cubic-bezier(0.22,1,0.36,1);
`;

const BannerIcon = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const BannerContent = styled.div`flex: 1;`;

const BannerTitle = styled.p`
  margin: 0 0 2px;
  font-size: 0.88rem;
  font-weight: 800;
  color: #1a2e1a;
`;

const BannerDesc = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: #7b8f7f;
  line-height: 1.5;
`;

const BannerActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-shrink: 0;
`;

const EnableBtn = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 7px 16px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
  &:hover { background: #1e3d1a; }
`;

const DismissBtn = styled.button`
  background: none;
  border: none;
  font-size: 0.78rem;
  color: #9ca3af;
  cursor: pointer;
  font-weight: 600;
  &:hover { color: #6b7280; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 20px; height: 20px;
  border-radius: 50%;
  border: 2.5px solid #e8f0e8;
  border-top-color: #2f5a2a;
  animation: ${spin} 0.7s linear infinite;
`;
