import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes } from "styled-components";
import { useCreateListing } from "../../hooks/useCreateListing";
import { Clock, X, Camera } from "lucide-react";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const QUALITY_BADGES = [
  "Organic",
  "Free-Range",
  "Pesticide-Free",
  "Naturally Grown",
  "Certified",
  "Handpicked",
  "Locally Grown",
  "Non-GMO",
  "Heirloom",
  "Fresh Daily",
];

const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Poultry",
  "Honey",
  "Grains",
  "Meat",
  "Fish",
  "Eggs",
  "Other",
];

const UNITS = [
  { value: "kg", label: "per kg" },
  { value: "g", label: "per 100g" },
  { value: "piece", label: "per piece" },
  { value: "bunch", label: "per bunch" },
  { value: "crate", label: "per crate" },
  { value: "litre", label: "per litre" },
  { value: "dozen", label: "per dozen" },
  { value: "bag", label: "per bag" },
  { value: "custom", label: "custom…" },
];

const DESC_MAX = 400;

const NewListing = () => {
  const { mutate, isPending } = useCreateListing();
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [minimumOrder, setMinimumOrder] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [unit, setUnit] = useState("kg");
  const [customUnit, setCustomUnit] = useState("");
  const [phone, setPhone] = useState("");
  const [available, setAvailable] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [badges, setBadges] = useState([]);
  const [priceTiers, setPriceTiers] = useState([]);

  const handleBack = () => navigate(-1);

  const applyFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleImageChange = (e) => applyFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    applyFile(e.dataTransfer.files[0]);
  };

  const resolvedUnit = unit === "custom" ? customUnit : unit;

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(
      {
        title: name,
        description,
        price,
        minimumOrder,
        location,
        category,
        image,
        unit: resolvedUnit,
        phone,
        available,
        badges,
        price_tiers: priceTiers.filter((t) => t.min_qty && t.price),
      },
      { onSuccess: () => setSubmitted(true) },
    );
  };

  if (submitted) {
    return (
      <>
        <AppNavbar />
        <PendingPage>
          <PendingCard>
            <PendingIcon><Clock size={32} color="#4a7c45" /></PendingIcon>
            <PendingTitle>Listing Submitted!</PendingTitle>
            <PendingMessage>
              Your listing is currently <strong>under review</strong> by our team.
              Once approved, it will go live and be visible to buyers on AFARMER™.
            </PendingMessage>
            <PendingSteps>
              <PendingStep $done>
                <StepDot $done />
                <span>Listing submitted</span>
              </PendingStep>
              <PendingStep>
                <StepDot />
                <span>Admin review</span>
              </PendingStep>
              <PendingStep>
                <StepDot />
                <span>Goes live for buyers</span>
              </PendingStep>
            </PendingSteps>
            <PendingNote>
              You'll receive a notification once your listing has been reviewed.
            </PendingNote>
            <PendingActions>
              <PendingPrimary onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </PendingPrimary>
              <PendingSecondary onClick={() => navigate("/mobile")}>
                Back to Home
              </PendingSecondary>
            </PendingActions>
          </PendingCard>
        </PendingPage>
      </>
    );
  }

  return (
    <>
      <AppNavbar />
      <Page>
        {/* ── Sticky header ── */}
        <StickyHeader>
          <BackBtn onClick={handleBack} aria-label="Go back">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </BackBtn>
          <HeaderTitle>New Listing</HeaderTitle>
          <HeaderSpacer />
        </StickyHeader>

        <Body>
          <form onSubmit={handleSubmit}>
            {/* ── Section: What are you selling? ── */}
            <Section>
              <SectionLabel>What are you selling?</SectionLabel>

              <Field>
                <FieldLabel htmlFor="name">Item Name *</FieldLabel>
                <FieldInput
                  id="name"
                  placeholder="e.g. Fresh Tomatoes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Category</FieldLabel>
                <ChipGrid>
                  {CATEGORIES.map((c) => (
                    <Chip
                      key={c}
                      type="button"
                      $active={category === c}
                      onClick={() => setCategory(category === c ? "" : c)}
                    >
                      {c}
                    </Chip>
                  ))}
                </ChipGrid>
              </Field>

              <Field>
                <FieldLabel htmlFor="description">
                  Description
                  <CharCount $warn={description.length > DESC_MAX * 0.9}>
                    {description.length}/{DESC_MAX}
                  </CharCount>
                </FieldLabel>
                <FieldTextarea
                  id="description"
                  placeholder="Describe your product — freshness, quantity available, how it was grown…"
                  value={description}
                  rows={4}
                  maxLength={DESC_MAX}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>

              {/* Availability toggle — sellers mark stock as available or out of stock */}
              <Field>
                <FieldLabel>Availability</FieldLabel>
                <ChipGrid>
                  <Chip type="button" $active={available} onClick={() => setAvailable(true)}>
                    Available
                  </Chip>
                  <Chip type="button" $active={!available} onClick={() => setAvailable(false)}
                    style={!available ? { background: "#a32d2d", borderColor: "#a32d2d" } : {}}>
                    Out of Stock
                  </Chip>
                </ChipGrid>
              </Field>
            </Section>

            {/* ── Section: Pricing ── */}
            <Section>
              <SectionLabel>Pricing</SectionLabel>

              <PriceRow>
                <Field style={{ flex: 1 }}>
                  <FieldLabel htmlFor="price">Price (Kes) *</FieldLabel>
                  <FieldInput
                    id="price"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </Field>
                <Field style={{ flex: 1 }}>
                  <FieldLabel htmlFor="unit">Unit</FieldLabel>
                  <FieldSelect
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    {UNITS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </FieldSelect>
                </Field>
              </PriceRow>

              {unit === "custom" && (
                <Field>
                  <FieldLabel htmlFor="customUnit">
                    Custom unit label
                  </FieldLabel>
                  <FieldInput
                    id="customUnit"
                    placeholder="e.g. per 5 kg bag"
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value)}
                  />
                </Field>
              )}

              <Field>
                <FieldLabel htmlFor="minOrder">Minimum Order</FieldLabel>
                <FieldInput
                  id="minOrder"
                  placeholder="e.g. 2 kg, 1 crate"
                  value={minimumOrder}
                  onChange={(e) => setMinimumOrder(e.target.value)}
                />
              </Field>

              {/* Bulk pricing tiers */}
              <Field>
                <FieldLabel>
                  Bulk Pricing (optional)
                  <span style={{ fontWeight: 500, fontSize: "0.75rem", color: "#9ca3af" }}>Lower price for larger orders</span>
                </FieldLabel>
                {priceTiers.map((tier, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                    <FieldInput
                      type="number"
                      min="1"
                      placeholder="Min qty"
                      value={tier.min_qty}
                      style={{ flex: 1 }}
                      onChange={(e) => {
                        const t = [...priceTiers];
                        t[i] = { ...t[i], min_qty: e.target.value };
                        setPriceTiers(t);
                      }}
                    />
                    <FieldInput
                      type="number"
                      min="0"
                      placeholder="Price (Kes)"
                      value={tier.price}
                      style={{ flex: 1 }}
                      onChange={(e) => {
                        const t = [...priceTiers];
                        t[i] = { ...t[i], price: e.target.value };
                        setPriceTiers(t);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setPriceTiers(priceTiers.filter((_, j) => j !== i))}
                      style={{ background: "none", border: "none", color: "#ef4444", fontSize: "1.1rem", cursor: "pointer", padding: "0 4px" }}
                    ><X size={14} /></button>
                  </div>
                ))}
                {priceTiers.length < 3 && (
                  <button
                    type="button"
                    onClick={() => setPriceTiers([...priceTiers, { min_qty: "", price: "" }])}
                    style={{ background: "none", border: "1.5px dashed #cde5cf", borderRadius: 10, padding: "8px 16px", fontSize: "0.82rem", color: "#2f5a2a", fontWeight: 700, cursor: "pointer", width: "100%" }}
                  >
                    + Add bulk tier
                  </button>
                )}
                <FieldHint>e.g. 10 kg at Kes 70, 50 kg at Kes 55</FieldHint>
              </Field>
            </Section>

            {/* ── Section: Quality Badges ── */}
            <Section>
              <SectionLabel>Quality Badges</SectionLabel>
              <Field>
                <FieldLabel>Select all that apply</FieldLabel>
                <ChipGrid>
                  {QUALITY_BADGES.map((b) => (
                    <Chip
                      key={b}
                      type="button"
                      $active={badges.includes(b)}
                      onClick={() =>
                        setBadges(
                          badges.includes(b)
                            ? badges.filter((x) => x !== b)
                            : [...badges, b],
                        )
                      }
                    >
                      {b}
                    </Chip>
                  ))}
                </ChipGrid>
                <FieldHint style={{ marginTop: 8 }}>
                  Badges appear on your listing and help buyers find certified produce.
                </FieldHint>
              </Field>
            </Section>

            {/* ── Section: Details ── */}
            <Section>
              <SectionLabel>Details</SectionLabel>

              <Field>
                <FieldLabel htmlFor="location">Location *</FieldLabel>
                <FieldInput
                  id="location"
                  placeholder="e.g. Kisumu, Kondele Market"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">WhatsApp / Phone</FieldLabel>
                <PhoneInputWrap>
                  <PhonePrefix>+254</PhonePrefix>
                  <FieldInput
                    id="phone"
                    type="tel"
                    placeholder="7XX XXX XXX"
                    value={phone}
                    style={{
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      borderLeft: "none",
                    }}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </PhoneInputWrap>
                <FieldHint>
                  Buyers will use this to contact you via WhatsApp or call.
                </FieldHint>
              </Field>
            </Section>

            {/* ── Section: Photo ── */}
            <Section>
              <SectionLabel>Photo</SectionLabel>

              {preview ? (
                <PreviewWrap>
                  <PreviewImg src={preview} alt="preview" />
                  <PreviewActions>
                    <PreviewLabel htmlFor="imageUpload">
                      Change photo
                    </PreviewLabel>
                    <PreviewRemove
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setPreview(null);
                      }}
                    >
                      Remove
                    </PreviewRemove>
                  </PreviewActions>
                </PreviewWrap>
              ) : (
                <DropZone
                  $dragOver={dragOver}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("imageUpload").click()}
                >
                  <DropIcon><Camera size={28} color="#4a7c45" /></DropIcon>
                  <DropText>Tap to upload a photo</DropText>
                  <DropHint>or drag and drop · JPG, PNG, WEBP</DropHint>
                </DropZone>
              )}

              <HiddenInput
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Section>

            {/* ── Submit ── */}
            <SubmitBtn type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner />
                  Creating listing…
                </>
              ) : (
                "Publish Listing"
              )}
            </SubmitBtn>
          </form>
        </Body>
      </Page>
    </>
  );
};

export default NewListing;

// ─── Styled components ────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
`;

const PendingPage = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const PendingCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 40px 28px 32px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 8px 40px rgba(20, 57, 32, 0.1);
  animation: ${fadeUp} 0.4s ease;
`;

const PendingIcon = styled.div`
  font-size: 3.2rem;
  margin-bottom: 16px;
  line-height: 1;
`;

const PendingTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 12px;
  letter-spacing: -0.3px;
`;

const PendingMessage = styled.p`
  font-size: 0.92rem;
  color: #4b5563;
  line-height: 1.75;
  margin: 0 0 24px;
  strong { color: #2f5a2a; }
`;

const PendingSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  background: #f5f8f5;
  border-radius: 14px;
  padding: 16px 18px;
  margin-bottom: 18px;
`;

const PendingStep = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  font-weight: ${({ $done }) => ($done ? "700" : "500")};
  color: ${({ $done }) => ($done ? "#2f5a2a" : "#9ca3af")};
`;

const StepDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $done }) => ($done ? "#2f5a2a" : "#d1d5db")};
`;

const PendingNote = styled.p`
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0 0 24px;
  line-height: 1.6;
`;

const PendingActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PendingPrimary = styled.button`
  width: 100%;
  padding: 13px;
  border-radius: 12px;
  background: #2f5a2a;
  color: white;
  border: none;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #245026; }
`;

const PendingSecondary = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background: transparent;
  color: #4b5563;
  border: 1.5px solid #e5e7eb;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #f9fafb; border-color: #d1d5db; }
`;

const StickyHeader = styled.div`
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
  box-shadow: 0 1px 8px rgba(20, 57, 32, 0.06);
`;

const BackBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #1a3318;
  flex-shrink: 0;
  transition: background 0.15s;
  &:hover {
    background: #f0fdf4;
  }
`;

const HeaderTitle = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 1rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0;
  letter-spacing: -0.2px;
`;

const HeaderSpacer = styled.div`
  width: 36px;
  flex-shrink: 0;
`;

const Body = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 20px 16px 40px;
  animation: ${fadeUp} 0.35s ease;
`;

const Section = styled.div`
  background: white;
  border-radius: 18px;
  padding: 22px 20px;
  margin-bottom: 14px;
  border: 1px solid #e8f5e9;
  box-shadow: 0 2px 10px rgba(20, 57, 32, 0.05);
`;

const SectionLabel = styled.p`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4e9643;
  margin: 0 0 18px;
`;

const Field = styled.div`
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const FieldLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.83rem;
  font-weight: 700;
  color: #1a3318;
  margin-bottom: 7px;
`;

const CharCount = styled.span`
  font-size: 0.72rem;
  font-weight: 500;
  color: ${({ $warn }) => ($warn ? "#ef4444" : "#9ca3af")};
`;

const fieldBase = `
  width: 100%;
  padding: 11px 14px;
  border-radius: 12px;
  border: 1.5px solid #e5e7eb;
  font-size: 16px;
  color: #111827;
  background: #fafcfa;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
  &:focus {
    border-color: #2f5a2a;
    box-shadow: 0 0 0 3px rgba(47,90,42,0.08);
    background: white;
  }
  &::placeholder { color: #c4d4c4; }
`;

const FieldInput = styled.input`
  ${fieldBase}
`;
const FieldTextarea = styled.textarea`
  ${fieldBase} resize: vertical;
  min-height: 100px;
`;
const FieldSelect = styled.select`
  ${fieldBase} cursor: pointer;
`;

const PhoneInputWrap = styled.div`
  display: flex;
  align-items: stretch;
`;
const PhonePrefix = styled.span`
  display: flex;
  align-items: center;
  padding: 0 12px;
  background: #f3f4f6;
  border: 1.5px solid #e5e7eb;
  border-right: none;
  border-radius: 12px 0 0 12px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4b5563;
  white-space: nowrap;
`;
const FieldHint = styled.p`
  font-size: 0.74rem;
  color: #9ca3af;
  margin: 5px 0 0;
`;

// Category chips
const ChipGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.button`
  padding: 7px 15px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  border: 1.5px solid;
  transition: all 0.15s;
  background: ${({ $active }) => ($active ? "#2f5a2a" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#4b5563")};
  border-color: ${({ $active }) => ($active ? "#2f5a2a" : "#e5e7eb")};
  &:hover {
    background: ${({ $active }) => ($active ? "#245026" : "#f0fdf4")};
    border-color: ${({ $active }) => ($active ? "#245026" : "#bbf7d0")};
  }
`;

// Price row
const PriceRow = styled.div`
  display: flex;
  gap: 12px;
  @media (max-width: 400px) {
    flex-direction: column;
  }
`;

// Image upload
const DropZone = styled.div`
  border: 2px dashed ${({ $dragOver }) => ($dragOver ? "#2f5a2a" : "#cde5cf")};
  border-radius: 16px;
  background: ${({ $dragOver }) => ($dragOver ? "#f0fdf4" : "#fafcfa")};
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s;
  &:hover {
    border-color: #2f5a2a;
    background: #f0fdf4;
  }
`;

const DropIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 10px;
`;
const DropText = styled.p`
  font-size: 0.92rem;
  font-weight: 700;
  color: #1a3318;
  margin: 0 0 4px;
`;
const DropHint = styled.p`
  font-size: 0.76rem;
  color: #9ca3af;
  margin: 0;
`;

const PreviewWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
const PreviewImg = styled.img`
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 14px;
  border: 1.5px solid #e8f5e9;
  flex-shrink: 0;
`;
const PreviewActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const PreviewLabel = styled.label`
  font-size: 0.84rem;
  font-weight: 700;
  color: #2f5a2a;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
const PreviewRemove = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 0.82rem;
  color: #ef4444;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  &:hover {
    text-decoration: underline;
  }
`;
const HiddenInput = styled.input`
  display: none;
`;

// Submit
const SubmitBtn = styled.button`
  width: 100%;
  padding: 15px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #2f5a2a, #4e9643);
  color: white;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition:
    opacity 0.2s,
    transform 0.2s;
  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  animation: ${spin} 0.7s linear infinite;
`;
