import { useState } from "react";
import styled from "styled-components";
import { useLanguage, LANGUAGES } from "../../context/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <Wrap>
      <Trigger onClick={() => setOpen((p) => !p)} aria-label="Change language">
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <Arrow $open={open}>▾</Arrow>
      </Trigger>

      {open && (
        <Dropdown>
          {LANGUAGES.map((l) => (
            <Option
              key={l.code}
              $active={l.code === lang}
              onClick={() => { setLang(l.code); setOpen(false); }}
            >
              {l.flag} {l.label}
            </Option>
          ))}
        </Dropdown>
      )}
    </Wrap>
  );
}

const Wrap = styled.div`
  position: relative;
  display: inline-block;
`;

const Trigger = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 5px 10px;
  font-size: 0.78rem;
  font-weight: 700;
  color: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
  &:hover { background: rgba(255,255,255,0.18); }
`;

const Arrow = styled.span`
  font-size: 0.7rem;
  transition: transform 0.2s;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.15);
  overflow: hidden;
  min-width: 140px;
  z-index: 200;
`;

const Option = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: ${({ $active }) => ($active ? "#eef7ee" : "white")};
  color: ${({ $active }) => ($active ? "#2f5a2a" : "#1a2e1a")};
  font-size: 0.85rem;
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;
  &:hover { background: #f5fbf5; }
`;
