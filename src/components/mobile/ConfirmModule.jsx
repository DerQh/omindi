import styled from "styled-components";

const DeleteButton = styled.button`
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999; /* Ensure it floats above layout hooks */
`;

const ModalBox = styled.div`
  margin: 40px;
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;
const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  gap: 12px;
`;

const CancelBtn = styled.button`
  flex: 1;
  background: #f0f0f0;
  border: none;
  padding: 10px;
  border-radius: 4px;
  font-weight: bold;
`;

const ConfirmBtn = styled.button`
  flex: 1;
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  font-weight: bold;
`;

export default function ConfirmModule({ onConfirm, onCancel }) {
  return (
    // 1. Trigger the onCancel prop when clicking the dark background overlay
    <ModalOverlay onClick={onCancel}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <h3>Are you sure?</h3>
        <p>Do you really want to delete this listing?</p>

        <ButtonGroup>
          {/* 2. Trigger the onCancel prop when clicking the Cancel button */}
          <CancelBtn onClick={onCancel}>Cancel</CancelBtn>

          {/* 3. Trigger the onConfirm prop when clicking the Delete button */}
          <ConfirmBtn onClick={onConfirm}>Delete</ConfirmBtn>
        </ButtonGroup>
      </ModalBox>
    </ModalOverlay>
  );
}
