import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes } from "styled-components";
import { useCreatePost } from "../../hooks/usePosts";

// ─── Animations ───────────────────────────────────────────────────────────────

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Type config ──────────────────────────────────────────────────────────────

const POST_TYPES = [
  { value: "update", label: "Update", description: "Share a farm update" },
  { value: "news", label: "News", description: "Industry news" },
  { value: "event", label: "Event", description: "Announce an event" },
  { value: "market", label: "Market", description: "Market activity" },
];

const TYPE_COLORS = {
  update: { bg: "#ecfdf5", color: "#065f46", border: "#6ee7b7" },
  news: { bg: "#fefce8", color: "#854d0e", border: "#fde68a" },
  event: { bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe" },
  market: { bg: "#fdf4ff", color: "#7e22ce", border: "#e9d5ff" },
};

// ─── Page Shell ───────────────────────────────────────────────────────────────

const Container = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
  padding-bottom: 48px;
`;

// ─── Cover ────────────────────────────────────────────────────────────────────

const CoverWrap = styled.div`
  max-width: 640px;
  margin: 20px auto 0;
  padding: 0 20px;
`;

const Cover = styled.div`
  position: relative;
  height: 160px;
  background: linear-gradient(135deg, #2f5a2a 0%, #3d7a35 60%, #4e9643 100%);
  overflow: hidden;
  border-radius: 20px;

  &::before {
    content: "";
    position: absolute;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    top: -70px;
    right: -40px;
  }
  &::after {
    content: "";
    position: absolute;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    bottom: -30px;
    left: 30px;
  }
`;

const BackBtn = styled.button`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.35);
  }
`;

const CoverTitle = styled.div`
  position: absolute;
  bottom: 24px;
  left: 24px;

  h1 {
    margin: 0 0 2px;
    color: white;
    font-size: 1.6rem;
    font-weight: 800;
  }
  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.9rem;
  }
`;

// ─── Content ──────────────────────────────────────────────────────────────────

const Content = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 28px 20px 0;
  animation: ${slideUp} 0.35s ease;
`;

// ─── Type Selector ────────────────────────────────────────────────────────────

const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 24px;
`;

const TypeChip = styled.button`
  padding: 14px 12px;
  border-radius: 14px;
  border: 2px solid
    ${({ $active, $colors }) => ($active ? $colors.border : "#e2ece2")};
  background: ${({ $active, $colors }) => ($active ? $colors.bg : "white")};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  box-shadow: ${({ $active }) =>
    $active ? "0 4px 14px rgba(20,57,32,0.1)" : "none"};

  &:hover {
    border-color: ${({ $colors }) => $colors.border};
    background: ${({ $colors }) => $colors.bg};
  }

  .label {
    display: block;
    font-size: 0.92rem;
    font-weight: 700;
    color: ${({ $active, $colors }) => ($active ? $colors.color : "#1a3318")};
    margin-bottom: 2px;
  }

  .desc {
    display: block;
    font-size: 0.78rem;
    color: #7b8f7f;
  }
`;

// ─── Form Card ────────────────────────────────────────────────────────────────

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  margin-bottom: 16px;
`;

const SectionLabel = styled.p`
  margin: 0 0 10px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #7b8f7f;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  border: 1.5px solid #e2ece2;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  color: #1a3318;
  background: #fafcfa;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: #b0c4b0;
  }

  &:focus {
    outline: none;
    border-color: #2f5a2a;
    box-shadow: 0 0 0 3px rgba(47, 90, 42, 0.08);
    background: white;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  border: 1.5px solid #e2ece2;
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: inherit;
  color: #1a3318;
  background: #fafcfa;
  resize: none;
  min-height: 140px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: #b0c4b0;
  }

  &:focus {
    outline: none;
    border-color: #2f5a2a;
    box-shadow: 0 0 0 3px rgba(47, 90, 42, 0.08);
    background: white;
  }
`;

const CharCount = styled.p`
  margin: 6px 0 0;
  font-size: 0.78rem;
  color: ${({ $over }) => ($over ? "#c0392b" : "#b0c4b0")};
  text-align: right;
`;

// ─── Image Upload ─────────────────────────────────────────────────────────────

const ImageZone = styled.div`
  border: 2px dashed ${({ $hasImage }) => ($hasImage ? "#2f5a2a" : "#cde5cf")};
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
  background: ${({ $hasImage }) => ($hasImage ? "transparent" : "#fafcfa")};

  &:hover {
    border-color: #2f5a2a;
    background: #f0f8f0;
  }
`;

const ImagePlaceholder = styled.div`
  padding: 32px 20px;
  text-align: center;

  p {
    margin: 8px 0 0;
    color: #7b8f7f;
    font-size: 0.88rem;
  }
  span {
    font-size: 2rem;
  }
`;

const ImagePreview = styled.div`
  position: relative;

  img {
    width: 100%;
    max-height: 260px;
    object-fit: cover;
    display: block;
  }
`;

const RemoveImageBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  border: none;
  color: white;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

// ─── Submit ───────────────────────────────────────────────────────────────────

const SubmitBtn = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  background: #2f5a2a;
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.15s ease;
  margin-bottom: 8px;

  &:hover:not(:disabled) {
    background: #245026;
    transform: translateY(-1px);
  }
  &:disabled {
    background: #b0c4b0;
    cursor: not-allowed;
  }
`;

const MAX_CONTENT = 500;

// ─── Component ────────────────────────────────────────────────────────────────

const Update = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreatePost();
  const fileInputRef = useRef(null);

  const [type, setType] = useState("update");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handles file selection and creates a local preview URL.
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Clears the selected image and its preview.
  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Submits the post to Supabase and navigates back to community on success.
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(
      { title, content, type, image },
      { onSuccess: () => navigate("/community") },
    );
  };

  const isOver = content.length > MAX_CONTENT;
  const canSubmit = title.trim() && content.trim() && !isOver && !isPending;

  return (
    <>
      <AppNavbar />
      <Container>
        <CoverWrap>
          <Cover>
            <BackBtn onClick={() => navigate(-1)}>←</BackBtn>
            <CoverTitle>
              <h1>Share a Post</h1>
              <p>Let the community know what's happening</p>
            </CoverTitle>
          </Cover>
        </CoverWrap>

        <Content>
          {/* ── Post type ── */}
          <SectionLabel>Post type</SectionLabel>
          <TypeGrid>
            {POST_TYPES.map((t) => (
              <TypeChip
                key={t.value}
                type="button"
                $active={type === t.value}
                $colors={TYPE_COLORS[t.value]}
                onClick={() => setType(t.value)}
              >
                <span className="label">{t.label}</span>
                <span className="desc">{t.description}</span>
              </TypeChip>
            ))}
          </TypeGrid>

          {/* ── Title + Content ── */}
          <Card>
            <SectionLabel>Title</SectionLabel>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a title…"
              required
            />

            <div style={{ marginTop: 18 }}>
              <SectionLabel>Content</SectionLabel>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your update with the community…"
                required
              />
              <CharCount $over={isOver}>
                {content.length} / {MAX_CONTENT}
              </CharCount>
            </div>
          </Card>

          {/* ── Image upload ── */}
          <Card>
            <SectionLabel>Photo (optional)</SectionLabel>
            <ImageZone
              $hasImage={!!preview}
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <ImagePreview>
                  <img src={preview} alt="preview" />
                  <RemoveImageBtn onClick={handleRemoveImage}>✕</RemoveImageBtn>
                </ImagePreview>
              ) : (
                <ImagePlaceholder>
                  <span>🖼️</span>
                  <p>Tap to add a photo</p>
                </ImagePlaceholder>
              )}
            </ImageZone>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </Card>

          {/* ── Submit ── */}
          <SubmitBtn type="button" disabled={!canSubmit} onClick={handleSubmit}>
            {isPending ? "Posting…" : "Post to Community"}
          </SubmitBtn>
        </Content>
      </Container>
    </>
  );
};

export default Update;
