import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useAddShopItem } from "../../hooks/useShopAdmin";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(24px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const spin = keyframes`to { transform: rotate(360deg); }`;

// ─── Overlay & Modal ─────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease;
`;

const Modal = styled.div`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
  animation: ${slideUp} 0.3s ease;
  scrollbar-width: thin;
`;

const ModalHeader = styled.div`
  padding: 24px 28px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: #1a2e1a;
`;

const CloseBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #f0f7ee;
  color: #2f5a2a;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:hover { background: #d7edd9; }
`;

// ─── Form ─────────────────────────────────────────────────────────────────────

const Form = styled.form`
  padding: 20px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const SectionLabel = styled.p`
  margin: 0 0 14px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: #7b8f7f;
`;

const SectionBlock = styled.div`
  background: #f8faf6;
  border-radius: 14px;
  padding: 18px;
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ $cols }) => $cols || "1fr"};
  gap: 14px;

  @media (max-width: 500px) { grid-template-columns: 1fr; }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.78rem;
  font-weight: 700;
  color: #1a2e1a;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const inputBase = `
  padding: 10px 14px;
  border: 1.5px solid #d7edd9;
  border-radius: 10px;
  font-size: 0.9rem;
  color: #1a2e1a;
  background: white;
  outline: none;
  font-family: inherit;
  transition: border-color 0.15s;
  width: 100%;
  box-sizing: border-box;

  &::placeholder { color: #aac4aa; }
  &:focus { border-color: #2f5a2a; }
`;

const Input = styled.input`${inputBase}`;

const Textarea = styled.textarea`
  ${inputBase}
  resize: vertical;
  min-height: 90px;
  line-height: 1.6;
`;

const Select = styled.select`
  ${inputBase}
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%232f5a2a' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
`;

// ─── Image Upload ─────────────────────────────────────────────────────────────

const ImageUploadArea = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 2px dashed ${({ $hasImage }) => ($hasImage ? "#2f5a2a" : "#cde5cf")};
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  background: ${({ $hasImage }) => ($hasImage ? "#eef7ee" : "white")};
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  min-height: 120px;

  &:hover { border-color: #2f5a2a; background: #f5f8f5; }
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 160px;
  object-fit: cover;
  border-radius: 8px;
`;

const UploadHint = styled.p`
  margin: 0;
  font-size: 0.82rem;
  color: #7b8f7f;
  text-align: center;
`;

const UploadIcon = styled.div`font-size: 2rem;`;

// ─── Footer Buttons ───────────────────────────────────────────────────────────

const FooterRow = styled.div`
  display: flex;
  gap: 12px;
  padding: 0 28px 28px;
`;

const CancelBtn = styled.button`
  flex: 1;
  padding: 13px;
  border-radius: 12px;
  border: 2px solid #d7edd9;
  background: white;
  color: #2f5a2a;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;

  &:hover { background: #eef7ee; border-color: #2f5a2a; }
`;

const SaveBtn = styled.button`
  flex: 2;
  padding: 13px;
  border-radius: 12px;
  border: none;
  background: #2f5a2a;
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s;

  &:hover:not(:disabled) { background: #1e3d1a; }
  &:disabled { background: #9db79b; cursor: not-allowed; }
`;

const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  display: inline-block;
`;

const ErrorMsg = styled.p`
  margin: 0;
  font-size: 0.82rem;
  color: #a32d2d;
  background: #fdf0f0;
  border: 1px solid #f5c6c2;
  border-radius: 8px;
  padding: 10px 14px;
`;

// ─── Component ────────────────────────────────────────────────────────────────

const EMPTY = { name: "", price: "", category: "Apparel", badge: "", description: "", stock: "", sku: "", image: null };

export default function AddShopItem({ onClose }) {
  const { mutate, isPending, isError, error } = useAddShopItem();
  const [form, setForm] = useState(EMPTY);
  const [preview, setPreview] = useState(null);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    set("image", file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(form, { onSuccess: onClose });
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>

        <ModalHeader>
          <ModalTitle>Add Shop Item</ModalTitle>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>

          {/* ── Product info ── */}
          <SectionBlock>
            <SectionLabel>Product Info</SectionLabel>
            <FieldGrid>
              <Field>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Afarmer Water Bottle"
                  required
                />
              </Field>
            </FieldGrid>

            <FieldGrid $cols="1fr 1fr" style={{ marginTop: 14 }}>
              <Field>
                <Label htmlFor="price">Price (Kes) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="e.g. 1500"
                  required
                />
              </Field>
              <Field>
                <Label htmlFor="stock">Stock Qty *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => set("stock", e.target.value)}
                  placeholder="e.g. 20"
                  required
                />
              </Field>
            </FieldGrid>

            <FieldGrid $cols="1fr 1fr" style={{ marginTop: 14 }}>
              <Field>
                <Label htmlFor="category">Category *</Label>
                <Select
                  id="category"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  required
                >
                  <option value="Apparel">Apparel</option>
                  <option value="Accessories">Accessories</option>
                </Select>
              </Field>
              <Field>
                <Label htmlFor="badge">Badge</Label>
                <Select
                  id="badge"
                  value={form.badge}
                  onChange={(e) => set("badge", e.target.value)}
                >
                  <option value="">None</option>
                  <option value="New">New</option>
                  <option value="Bestseller">Bestseller</option>
                  <option value="Limited">Limited</option>
                </Select>
              </Field>
            </FieldGrid>

            <FieldGrid style={{ marginTop: 14 }}>
              <Field>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={form.sku}
                  onChange={(e) => set("sku", e.target.value)}
                  placeholder="e.g. AFM-BTL-007"
                />
              </Field>
            </FieldGrid>
          </SectionBlock>

          {/* ── Description ── */}
          <SectionBlock>
            <SectionLabel>Description</SectionLabel>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the product — material, use, sizing, etc."
              required
            />
          </SectionBlock>

          {/* ── Image ── */}
          <SectionBlock>
            <SectionLabel>Product Image</SectionLabel>
            <ImageUploadArea htmlFor="shopImage" $hasImage={!!preview}>
              {preview ? (
                <ImagePreview src={preview} alt="preview" />
              ) : (
                <>
                  <UploadIcon>🖼️</UploadIcon>
                  <UploadHint>Click to upload a product photo</UploadHint>
                  <UploadHint style={{ fontSize: "0.72rem" }}>JPG, PNG or WebP</UploadHint>
                </>
              )}
              <input
                id="shopImage"
                type="file"
                accept="image/*"
                onChange={handleImage}
                style={{ display: "none" }}
                required
              />
            </ImageUploadArea>
            {preview && (
              <button
                type="button"
                onClick={() => { setPreview(null); set("image", null); }}
                style={{ marginTop: 8, fontSize: "0.78rem", color: "#a32d2d", background: "none", border: "none", cursor: "pointer" }}
              >
                ✕ Remove image
              </button>
            )}
          </SectionBlock>

          {isError && (
            <ErrorMsg>
              ⚠️ {error?.message ?? "Failed to save. Please try again."}
            </ErrorMsg>
          )}

        </Form>

        <FooterRow>
          <CancelBtn type="button" onClick={onClose}>Cancel</CancelBtn>
          <SaveBtn
            type="submit"
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending ? <><Spinner /> Saving…</> : "Add to Shop"}
          </SaveBtn>
        </FooterRow>

      </Modal>
    </Overlay>
  );
}
