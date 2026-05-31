import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const popUp = keyframes`
  from { opacity: 0; transform: scale(0.92) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;

export default function ConfirmModule({ onConfirm, onCancel, text }) {
  return (
    <Overlay onClick={onCancel}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <IconWrap>
          <TrashIcon>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </TrashIcon>
        </IconWrap>

        <Title>Are you sure?</Title>
        <Message>{text}</Message>

        <ButtonGroup>
          <CancelBtn onClick={onCancel}>Cancel</CancelBtn>
          <DeleteBtn onClick={onConfirm}>Delete</DeleteBtn>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
}

// ─── Styled components ────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 24px;
  animation: ${fadeIn} 0.18s ease;
`;

const Modal = styled.div`
  background: white;
  border-radius: 22px;
  padding: 32px 28px 28px;
  width: 100%;
  max-width: 360px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: ${popUp} 0.22s ease;
`;

const IconWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 18px;
`;

const TrashIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #fef2f2;
  border: 1.5px solid #fecaca;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
`;

const Title = styled.h3`
  font-size: 1.05rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 8px;
  letter-spacing: -0.2px;
`;

const Message = styled.p`
  font-size: 0.88rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 26px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const CancelBtn = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  border: 1.5px solid #e5e7eb;
  background: white;
  color: #374151;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #f9fafb; }
`;

const DeleteBtn = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: #ef4444;
  color: white;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
  &:hover { background: #dc2626; transform: translateY(-1px); }
`;
