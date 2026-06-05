import { createContext, useContext, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

const ICONS = { success: "✓", error: "✕", info: "ℹ" };
const COLORS = {
  success: { bg: "#f0fdf4", border: "#86efac", color: "#166534" },
  error:   { bg: "#fef2f2", border: "#fca5a5", color: "#991b1b" },
  info:    { bg: "#eff6ff", border: "#93c5fd", color: "#1e40af" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastStack>
        {toasts.map((t) => (
          <ToastItem key={t.id} $type={t.type}>
            <ToastIcon $type={t.type}>{ICONS[t.type] ?? "ℹ"}</ToastIcon>
            <ToastMsg>{t.message}</ToastMsg>
            <DismissBtn onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}>
              ✕
            </DismissBtn>
          </ToastItem>
        ))}
      </ToastStack>
    </ToastContext.Provider>
  );
}

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-14px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const ToastStack = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  pointer-events: none;
  width: 100%;
  max-width: 380px;
  padding: 0 16px;
`;

const ToastItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  background: ${({ $type }) => COLORS[$type]?.bg ?? COLORS.info.bg};
  border: 1.5px solid ${({ $type }) => COLORS[$type]?.border ?? COLORS.info.border};
  color: ${({ $type }) => COLORS[$type]?.color ?? COLORS.info.color};
  box-shadow: 0 8px 28px rgba(0,0,0,0.1);
  animation: ${slideIn} 0.28s cubic-bezier(0.22,1,0.36,1);
  pointer-events: all;
  font-size: 0.9rem;
  font-weight: 600;
`;

const ToastIcon = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ $type }) => COLORS[$type]?.border ?? COLORS.info.border};
  color: ${({ $type }) => COLORS[$type]?.color ?? COLORS.info.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 900;
  flex-shrink: 0;
`;

const ToastMsg = styled.span`
  flex: 1;
  line-height: 1.4;
`;

const DismissBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  opacity: 0.5;
  padding: 2px;
  color: inherit;
  flex-shrink: 0;
  &:hover { opacity: 1; }
`;
