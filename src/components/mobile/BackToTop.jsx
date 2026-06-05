import { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <Btn onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">
      ↑
    </Btn>
  );
}

const Btn = styled.button`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #2f5a2a;
  color: white;
  border: none;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(47, 90, 42, 0.4);
  animation: ${fadeIn} 0.22s ease;
  transition: transform 0.15s, box-shadow 0.15s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(47, 90, 42, 0.5);
  }
  &:active { transform: scale(0.93); }
`;
