import { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";
import { shopProducts } from "../../data/shopProducts";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const toastIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Static option data ───────────────────────────────────────────────────────

const colors = [
  { value: "black", label: "Black", hex: "#1a1a1a" },
  { value: "white", label: "White", hex: "#f0f0f0" },
  { value: "green", label: "Green", hex: "#2f5a2a" },
];

const sizes = ["S", "M", "L", "XL", "XXL"];

const renderStars = (rating, interactive = false, hover = 0, onClick) =>
  Array.from({ length: 5 }, (_, i) => {
    const filled = interactive ? i < (hover || rating) : i < Math.round(rating);
    return (
      <StarIcon
        key={i}
        $filled={filled}
        $interactive={interactive}
        onMouseEnter={interactive ? () => onClick("hover", i + 1) : undefined}
        onMouseLeave={interactive ? () => onClick("hover", 0) : undefined}
        onClick={interactive ? () => onClick("set", i + 1) : undefined}
      >
        {filled ? "★" : "☆"}
      </StarIcon>
    );
  });

// ─── Page ─────────────────────────────────────────────────────────────────────

const Page = styled.div`
  background: #f7f9f7;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 32px 80px;

  @media (max-width: 600px) { padding: 20px 16px 60px; }
`;

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  margin-bottom: 28px;
  color: #7b8f7f;

  a {
    color: #2f5a2a;
    text-decoration: none;
    font-weight: 600;
    &:hover { text-decoration: underline; }
  }
`;

const BreadSep = styled.span`color: #cde5cf;`;

// ─── Product Layout ───────────────────────────────────────────────────────────

const ProductLayout = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 48px;
  align-items: start;
  margin-bottom: 56px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

// ─── Image Section ────────────────────────────────────────────────────────────

const ImageSection = styled.div`
  position: sticky;
  top: 100px;

  @media (max-width: 900px) { position: static; }
`;

const MainImage = styled.div`
  border-radius: 20px;
  overflow: hidden;
  background: #e8f0e8;
  aspect-ratio: 4/3;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;

    &:hover { transform: scale(1.03); }
  }
`;

// Thumbnail row — clicking would switch the main image in a real implementation
const ThumbRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 14px;
`;

const Thumb = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid ${({ $active }) => ($active ? "#2f5a2a" : "transparent")};
  cursor: pointer;
  background: #e8f0e8;
  transition: border-color 0.15s;

  img {
    width: 100%; height: 100%;
    object-fit: cover;
  }

  &:hover { border-color: #2f5a2a; }
`;

// ─── Product Summary ──────────────────────────────────────────────────────────

const Summary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  animation: ${fadeUp} 0.4s ease;
`;

const CategoryChip = styled.span`
  display: inline-block;
  background: #eef7ee;
  color: #2f5a2a;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
`;

const ProductTitle = styled.h1`
  margin: 0 0 10px;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 900;
  color: #1a2e1a;
  letter-spacing: -0.03em;
  line-height: 1.15;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
`;

const StarIcon = styled.span`
  font-size: ${({ $interactive }) => ($interactive ? "1.6rem" : "0.95rem")};
  color: ${({ $filled }) => ($filled ? "#f0b33d" : "#d0d8d0")};
  cursor: ${({ $interactive }) => ($interactive ? "pointer" : "default")};
  transition: color 0.12s;
  line-height: 1;
  user-select: none;
`;

const RatingText = styled.span`
  font-size: 0.88rem;
  font-weight: 700;
  color: #1a2e1a;
`;

const RatingCount = styled.span`
  font-size: 0.82rem;
  color: #7b8f7f;
`;

const Price = styled.p`
  margin: 0 0 18px;
  font-size: 2rem;
  font-weight: 900;
  color: #2f5a2a;
  letter-spacing: -0.03em;
`;

const HRule = styled.div`
  height: 1px;
  background: #e8f0e8;
  margin: 4px 0 22px;
`;

const DescText = styled.p`
  margin: 0 0 24px;
  font-size: 0.93rem;
  color: #556652;
  line-height: 1.75;
`;

// ─── Options ──────────────────────────────────────────────────────────────────

const OptionBlock = styled.div`
  margin-bottom: 22px;
`;

const OptionLabel = styled.p`
  margin: 0 0 10px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #1a2e1a;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SizeGuideLink = styled.a`
  font-size: 0.75rem;
  font-weight: 600;
  color: #2f5a2a;
  text-decoration: underline;
  text-transform: none;
  letter-spacing: 0;
  cursor: pointer;
`;

// Color swatches — circular buttons with the actual colour
const SwatchRow = styled.div`
  display: flex;
  gap: 10px;
`;

const Swatch = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${({ $hex }) => $hex};
  border: 3px solid ${({ $active }) => ($active ? "#2f5a2a" : "transparent")};
  outline: 2px solid ${({ $active }) => ($active ? "#2f5a2a" : "#e0ece0")};
  cursor: pointer;
  transition: outline-color 0.15s, border-color 0.15s, transform 0.15s;
  position: relative;

  &:hover { transform: scale(1.12); }
  &::after {
    content: "${({ $label }) => $label}";
    position: absolute;
    bottom: -22px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.65rem;
    color: #7b8f7f;
    white-space: nowrap;
  }
`;

// Size pill buttons
const SizePills = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const SizePill = styled.button`
  min-width: 48px;
  padding: 8px 14px;
  border-radius: 9px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  background: ${({ $active }) => ($active ? "#2f5a2a" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#556652")};
  border: 2px solid ${({ $active }) => ($active ? "#2f5a2a" : "#d7edd9")};

  &:hover {
    border-color: #2f5a2a;
    color: ${({ $active }) => ($active ? "white" : "#2f5a2a")};
  }
`;

// Quantity stepper — − / count / + instead of a plain number input
const QuantityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  border: 2px solid #d7edd9;
  border-radius: 12px;
  overflow: hidden;
  width: fit-content;
`;

const QtyBtn = styled.button`
  width: 42px;
  height: 44px;
  border: none;
  background: white;
  color: #2f5a2a;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: #eef7ee; }
  &:disabled { color: #cde5cf; cursor: not-allowed; }
`;

const QtyVal = styled.span`
  min-width: 44px;
  text-align: center;
  font-size: 1rem;
  font-weight: 700;
  color: #1a2e1a;
  border-left: 1px solid #e8f0e8;
  border-right: 1px solid #e8f0e8;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// ─── CTA Buttons ──────────────────────────────────────────────────────────────

const CtaRow = styled.div`
  display: flex;
  gap: 12px;
  margin: 24px 0 16px;

  @media (max-width: 480px) { flex-direction: column; }
`;

const AddBtn = styled.button`
  flex: 2;
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 15px 24px;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.18s, transform 0.12s;
  letter-spacing: 0.01em;

  &:hover { background: #1e3d1a; transform: translateY(-2px); }
  &:active { transform: translateY(0); }
`;

const WishBtn = styled.button`
  flex: 1;
  background: white;
  color: #2f5a2a;
  border: 2px solid #cde5cf;
  padding: 15px 18px;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover { background: #eef7ee; border-color: #2f5a2a; }
`;

// ─── Cart Toast ───────────────────────────────────────────────────────────────

const CartToast = styled.div`
  background: #eef7ee;
  border: 1.5px solid #a8d5ac;
  border-radius: 12px;
  padding: 13px 16px;
  font-size: 0.88rem;
  font-weight: 600;
  color: #2f5a2a;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: ${toastIn} 0.3s ease;
`;

const CartToastError = styled(CartToast)`
  background: #fdf0f0;
  border-color: #f5c6c2;
  color: #a32d2d;
`;

// ─── Trust Badges ─────────────────────────────────────────────────────────────

const TrustRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 20px 0;
`;

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f8f5;
  border-radius: 10px;
  padding: 10px 12px;
`;

const TrustIcon = styled.span`font-size: 1.1rem;`;

const TrustText = styled.p`
  margin: 0;
  font-size: 0.72rem;
  font-weight: 600;
  color: #556652;
  line-height: 1.35;
`;

const MetaRow = styled.div`
  display: flex;
  gap: 16px;
  font-size: 0.8rem;
  color: #7b8f7f;
  border-top: 1px solid #e8f0e8;
  padding-top: 16px;
  margin-top: 4px;
`;

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TabsWrap = styled.div`
  margin-bottom: 56px;
`;

const TabBar = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e8f0e8;
  margin-bottom: 28px;
`;

const TabBtn = styled.button`
  padding: 13px 28px;
  border: none;
  background: none;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#2f5a2a" : "#7b8f7f")};
  border-bottom: 3px solid ${({ $active }) => ($active ? "#2f5a2a" : "transparent")};
  margin-bottom: -2px;
  transition: color 0.15s, border-color 0.15s;

  &:hover { color: #2f5a2a; }
`;

const TabContent = styled.div`
  animation: ${slideIn} 0.25s ease;
`;

const TabCard = styled.div`
  background: white;
  border-radius: 18px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
`;

const InfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  tr {
    border-bottom: 1px solid #f0f7ee;
    &:last-child { border-bottom: none; }
  }

  td {
    padding: 12px 16px;
    font-size: 0.9rem;

    &:first-child {
      color: #7b8f7f;
      font-weight: 600;
      width: 180px;
    }

    &:last-child {
      color: #1a2e1a;
      font-weight: 500;
    }
  }
`;

// ─── Review Form ──────────────────────────────────────────────────────────────

const ReviewIntro = styled.p`
  margin: 0 0 20px;
  color: #7b8f7f;
  font-size: 0.9rem;
  line-height: 1.65;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  &.full { grid-column: 1 / -1; }
`;

const FieldLabel = styled.label`
  font-size: 0.82rem;
  font-weight: 700;
  color: #1a2e1a;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const inputStyles = css`
  padding: 12px 16px;
  border: 1.5px solid #d7edd9;
  border-radius: 10px;
  font-size: 16px;
  color: #1a2e1a;
  background: #f8faf6;
  outline: none;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.15s;

  &::placeholder { color: #aac4aa; }
  &:focus { border-color: #2f5a2a; background: white; }
`;

const Input = styled.input`${inputStyles}`;
const Textarea = styled.textarea`
  ${inputStyles}
  resize: vertical;
  min-height: 110px;
  line-height: 1.6;
`;

const StarRatingRow = styled.div`
  display: flex;
  gap: 4px;
  margin: 4px 0;
`;

const CheckRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  grid-column: 1 / -1;
  font-size: 0.88rem;
  color: #556652;
`;

const SubmitBtn = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 13px 32px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  grid-column: 1 / -1;
  width: fit-content;
  transition: background 0.18s;

  &:hover { background: #1e3d1a; }
`;

const StatusMsg = styled.div`
  padding: 13px 16px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  grid-column: 1 / -1;
  background: ${({ $error }) => ($error ? "#fdf0f0" : "#eef7ee")};
  color: ${({ $error }) => ($error ? "#a32d2d" : "#2f5a2a")};
  border: 1px solid ${({ $error }) => ($error ? "#f5c6c2" : "#a8d5ac")};
`;

// ─── Related Products ─────────────────────────────────────────────────────────

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
`;

const RelatedCard = styled(Link)`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: block;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.1);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
    background: #e8f0e8;
  }
`;

const RelatedBody = styled.div`
  padding: 14px 16px 18px;
`;

const RelatedName = styled.p`
  margin: 0 0 6px;
  font-size: 0.93rem;
  font-weight: 700;
  color: #1a2e1a;
`;

const RelatedPrice = styled.p`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 800;
  color: #2f5a2a;
`;

const SectionEyebrow = styled.p`
  margin: 0 0 6px;
  font-size: 0.73rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #2f5a2a;
`;

const SectionTitle = styled.h2`
  margin: 0 0 24px;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a2e1a;
  letter-spacing: -0.03em;
`;

// ─── Not-found state ──────────────────────────────────────────────────────────

const NotFoundWrap = styled.div`
  text-align: center;
  padding: 100px 24px;
`;

// ─── Component ────────────────────────────────────────────────────────────────

function Merchandise() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Look up the product by URL param — falls back to undefined if not found
  const product = shopProducts.find((p) => p.id === parseInt(id));

  // Related products: up to 3 others in the same category, excluding the current one
  const related = shopProducts
    .filter((p) => p.id !== product?.id && p.category === product?.category)
    .slice(0, 3)
    // If same-category doesn't fill 3, backfill from other products
    .concat(
      shopProducts
        .filter((p) => p.id !== product?.id && p.category !== product?.category)
        .slice(0, Math.max(0, 3 - shopProducts.filter((p) => p.id !== product?.id && p.category === product?.category).length))
    );

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize,  setSelectedSize]  = useState("");
  const [quantity,      setQuantity]      = useState(1);
  const [wishlist,      setWishlist]      = useState(false);
  const [cartMsg,       setCartMsg]       = useState({ text: "", error: false });
  const [activeTab,     setActiveTab]     = useState("description");

  // Interactive star rating for the review form
  const [hoverStar, setHoverStar] = useState(0);
  const [review, setReview] = useState({ name: "", email: "", rating: 0, comment: "" });
  const [reviewMsg, setReviewMsg] = useState({ text: "", error: false });

  // Show a clean not-found page if the ID doesn't match any product
  if (!product) {
    return (
      <>
        <Navbar />
        <Page>
          <NotFoundWrap>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🌿</div>
            <h2 style={{ color: "#1a2e1a", marginBottom: 8 }}>Product not found</h2>
            <p style={{ color: "#7b8f7f", marginBottom: 24 }}>This item doesn't exist or may have been removed.</p>
            <button
              onClick={() => navigate("/shop")}
              style={{ background: "#2f5a2a", color: "white", border: "none", padding: "12px 28px", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}
            >
              Back to Shop
            </button>
          </NotFoundWrap>
        </Page>
        <FooterContainer />
      </>
    );
  }

  const handleStarInteraction = (type, val) => {
    if (type === "hover") setHoverStar(val);
    if (type === "set")   setReview((p) => ({ ...p, rating: val }));
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      setCartMsg({ text: "Please choose a colour and size before adding to cart.", error: true });
      return;
    }
    setCartMsg({
      text: `✓ Added ${quantity} × ${product.name} (${selectedColor}, ${selectedSize}) to your cart.`,
      error: false,
    });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!review.rating || !review.comment.trim()) {
      setReviewMsg({ text: "Please provide a star rating and a written review.", error: true });
      return;
    }
    setReviewMsg({ text: "Thank you! Your review has been submitted successfully.", error: false });
    setReview({ name: "", email: "", rating: 0, comment: "" });
    setHoverStar(0);
  };

  return (
    <>
      <Navbar />
      <Page>
        <Container>

          {/* ── Breadcrumb ── */}
          <Breadcrumb>
            <Link to="/">Home</Link>
            <BreadSep>/</BreadSep>
            <Link to="/shop">Shop</Link>
            <BreadSep>/</BreadSep>
            <span>{product.category}</span>
            <BreadSep>/</BreadSep>
            <strong style={{ color: "#1a2e1a" }}>{product.name}</strong>
          </Breadcrumb>

          {/* ── Product layout ── */}
          <ProductLayout>

            {/* Left: sticky image gallery */}
            <ImageSection>
              <MainImage>
                <img loading="lazy" src={product.image} alt={product.name} />
              </MainImage>
              {/* Thumbnail row — clicking would switch main image in a real gallery */}
              <ThumbRow>
                {[1, 2, 3].map((_, i) => (
                  <Thumb key={i} $active={i === 0}>
                    <img loading="lazy" src={product.image} alt="" />
                  </Thumb>
                ))}
              </ThumbRow>
            </ImageSection>

            {/* Right: product summary */}
            <Summary>
              <CategoryChip>{product.category}</CategoryChip>
              <ProductTitle>{product.name}</ProductTitle>

              <RatingRow>
                {renderStars(product.rating)}
                <RatingText>{product.rating.toFixed(1)}</RatingText>
                <RatingCount>({product.reviews} reviews)</RatingCount>
              </RatingRow>

              <Price>Kes {product.price.toLocaleString()}</Price>
              <HRule />
              <DescText>{product.description}</DescText>

              {/* Colour swatches */}
              <OptionBlock>
                <OptionLabel>
                  Colour
                  {selectedColor && (
                    <span style={{ color: "#2f5a2a", fontWeight: 600, textTransform: "none", letterSpacing: 0 }}>
                      — {colors.find(c => c.value === selectedColor)?.label}
                    </span>
                  )}
                </OptionLabel>
                <SwatchRow>
                  {colors.map((c) => (
                    <Swatch
                      key={c.value}
                      $hex={c.hex}
                      $active={selectedColor === c.value}
                      $label={c.label}
                      onClick={() => setSelectedColor(c.value)}
                      title={c.label}
                    />
                  ))}
                </SwatchRow>
              </OptionBlock>

              {/* Size pills */}
              <OptionBlock style={{ marginTop: 18 }}>
                <OptionLabel>
                  Size
                  <SizeGuideLink href="#">Size guide →</SizeGuideLink>
                </OptionLabel>
                <SizePills>
                  {sizes.map((s) => (
                    <SizePill
                      key={s}
                      $active={selectedSize === s}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </SizePill>
                  ))}
                </SizePills>
              </OptionBlock>

              {/* Quantity stepper */}
              <OptionBlock>
                <OptionLabel>Quantity</OptionLabel>
                <QuantityRow>
                  <QtyBtn
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </QtyBtn>
                  <QtyVal>{quantity}</QtyVal>
                  <QtyBtn onClick={() => setQuantity((q) => q + 1)}>+</QtyBtn>
                </QuantityRow>
              </OptionBlock>

              {/* CTA buttons */}
              <CtaRow>
                <AddBtn onClick={handleAddToCart}>🛒 Add to Cart</AddBtn>
                <WishBtn onClick={() => setWishlist((w) => !w)}>
                  {wishlist ? "❤️" : "🤍"} Save
                </WishBtn>
              </CtaRow>

              {/* Cart feedback toast */}
              {cartMsg.text && (
                cartMsg.error
                  ? <CartToastError>{cartMsg.text}</CartToastError>
                  : <CartToast>{cartMsg.text}</CartToast>
              )}

              {/* Trust badges */}
              <TrustRow>
                <TrustBadge>
                  <TrustIcon>🚚</TrustIcon>
                  <TrustText>Free delivery over Kes 3,000</TrustText>
                </TrustBadge>
                <TrustBadge>
                  <TrustIcon>↩</TrustIcon>
                  <TrustText>14-day easy returns</TrustText>
                </TrustBadge>
                <TrustBadge>
                  <TrustIcon>🔒</TrustIcon>
                  <TrustText>Secure M-Pesa checkout</TrustText>
                </TrustBadge>
              </TrustRow>

              <MetaRow>
                <span>SKU: {product.sku}</span>
                <span>Category: {product.category}</span>
              </MetaRow>
            </Summary>
          </ProductLayout>

          {/* ── Tabs: Description | Details | Reviews ── */}
          <TabsWrap>
            <TabBar>
              {["description", "details", "reviews"].map((tab) => (
                <TabBtn
                  key={tab}
                  $active={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === "reviews" && ` (${product.reviews})`}
                </TabBtn>
              ))}
            </TabBar>

            <TabContent key={activeTab}>
              <TabCard>

                {activeTab === "description" && (
                  <p style={{ margin: 0, lineHeight: 1.8, color: "#556652", fontSize: "0.95rem" }}>
                    {product.description}
                  </p>
                )}

                {activeTab === "details" && (
                  <InfoTable>
                    <tbody>
                      {product.details.map((d) => (
                        <tr key={d.label}>
                          <td>{d.label}</td>
                          <td>{d.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </InfoTable>
                )}

                {activeTab === "reviews" && (
                  <>
                    <ReviewIntro>
                      Be the first to leave a review for "{product.name}". Your
                      email address will not be published. Required fields are marked *.
                    </ReviewIntro>

                    <form onSubmit={handleReviewSubmit}>
                      <FormGrid>
                        {/* Star rating */}
                        <FieldWrap className="full">
                          <FieldLabel>Your rating *</FieldLabel>
                          <StarRatingRow>
                            {renderStars(review.rating, true, hoverStar, handleStarInteraction)}
                          </StarRatingRow>
                        </FieldWrap>

                        {/* Review text */}
                        <FieldWrap className="full">
                          <FieldLabel>Your review *</FieldLabel>
                          <Textarea
                            name="comment"
                            value={review.comment}
                            onChange={(e) => setReview((p) => ({ ...p, comment: e.target.value }))}
                            placeholder="Share your experience with this product…"
                            required
                          />
                        </FieldWrap>

                        {/* Name & Email */}
                        <FieldWrap>
                          <FieldLabel>Name *</FieldLabel>
                          <Input
                            type="text"
                            name="name"
                            value={review.name}
                            onChange={(e) => setReview((p) => ({ ...p, name: e.target.value }))}
                            placeholder="Your name"
                            required
                          />
                        </FieldWrap>
                        <FieldWrap>
                          <FieldLabel>Email *</FieldLabel>
                          <Input
                            type="email"
                            name="email"
                            value={review.email}
                            onChange={(e) => setReview((p) => ({ ...p, email: e.target.value }))}
                            placeholder="your@email.com"
                            required
                          />
                        </FieldWrap>

                        <CheckRow>
                          <input type="checkbox" id="save-info" />
                          <label htmlFor="save-info" style={{ cursor: "pointer" }}>
                            Save my name and email for next time.
                          </label>
                        </CheckRow>

                        {reviewMsg.text && (
                          <StatusMsg $error={reviewMsg.error}>{reviewMsg.text}</StatusMsg>
                        )}

                        <SubmitBtn type="submit">Submit Review</SubmitBtn>
                      </FormGrid>
                    </form>
                  </>
                )}

              </TabCard>
            </TabContent>
          </TabsWrap>

          {/* ── Related products ── */}
          <div>
            <SectionEyebrow>You might also like</SectionEyebrow>
            <SectionTitle>Related Products</SectionTitle>
            <RelatedGrid>
              {related.map((item) => (
                <RelatedCard key={item.id} to={`/shop/item/${item.id}`}>
                  <img loading="lazy" src={item.image} alt={item.name} />
                  <RelatedBody>
                    <RelatedName>{item.name}</RelatedName>
                    <RelatedPrice>Kes {item.price.toLocaleString()}</RelatedPrice>
                  </RelatedBody>
                </RelatedCard>
              ))}
            </RelatedGrid>
          </div>

        </Container>
      </Page>
      <FooterContainer />
    </>
  );
}

export default Merchandise;
