import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes } from "styled-components";
import { useListing, useEditListing } from "../../hooks/useEditListing";
import LoadingComponent from "./Loading";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const CATEGORIES = [
  "Vegetables", "Fruits", "Dairy", "Poultry",
  "Honey", "Grains", "Meat", "Fish", "Eggs", "Other",
];

const UNITS = [
  { value: "kg",     label: "per kg" },
  { value: "g",      label: "per 100g" },
  { value: "piece",  label: "per piece" },
  { value: "bunch",  label: "per bunch" },
  { value: "crate",  label: "per crate" },
  { value: "litre",  label: "per litre" },
  { value: "dozen",  label: "per dozen" },
  { value: "bag",    label: "per bag" },
  { value: "custom", label: "custom…" },
];

const DESC_MAX = 400;

// ─── Component ────────────────────────────────────────────────────────────────

export function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: listing, isLoading } = useListing(id);
  const { mutate, isPending } = useEditListing();

  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice]             = useState("");
  const [minimumOrder, setMinimumOrder] = useState("");
  const [location, setLocation]       = useState("");
  const [category, setCategory]       = useState("");
  const [unit, setUnit]               = useState("kg");
  const [customUnit, setCustomUnit]   = useState("");
  const [phone, setPhone]             = useState("");
  const [available, setAvailable]     = useState(true);
  const [image, setImage]             = useState(null);   // new File or null
  const [preview, setPreview]         = useState(null);   // URL shown in preview

  // Pre-fill form fields once the listing data arrives from Supabase.
  useEffect(() => {
    if (!listing) return;
    setName(listing.title || "");
    setDescription(listing.description || "");
    setPrice(listing.price || "");
    setMinimumOrder(listing.minimumOrder || "");
    setLocation(listing.location || "");
    setCategory(listing.category || "");
    setPhone(listing.phone || "");
    setPreview(listing.image_url || null);
    setAvailable(listing.available !== false);

    // If the saved unit is not in the preset list treat it as custom.
    const knownUnit = UNITS.find((u) => u.value === listing.unit);
    if (knownUnit) {
      setUnit(listing.unit);
    } else {
      setUnit("custom");
      setCustomUnit(listing.unit || "");
    }
  }, [listing]);

  // Applies a selected file and creates a local preview blob URL.
  const applyFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Handles file input change events.
  const handleImageChange = (e) => applyFile(e.target.files[0]);

  // Handles drag-and-drop image uploads.
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    applyFile(e.dataTransfer.files[0]);
  };

  const [dragOver, setDragOver] = useState(false);

  const resolvedUnit = unit === "custom" ? customUnit : unit;

  // Submits the updated listing fields to Supabase and navigates back on success.
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(
      {
        listingId: id,
        title: name,
        description,
        price,
        minimumOrder,
        location,
        category,
        unit: resolvedUnit,
        phone,
        image,                          // null = keep existing image
        available,
        existingImageUrl: listing?.image_url,
      },
      { onSuccess: () => navigate("/list") },
    );
  };

  if (isLoading) return <LoadingComponent />;

  return (
    <>
      <AppNavbar />
      <Page>

        {/* ── Sticky header ── */}
        <StickyHeader>
          <BackBtn onClick={() => navigate(-1)} aria-label="Go back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </BackBtn>
          <HeaderTitle>Edit Listing</HeaderTitle>
          <HeaderSpacer />
        </StickyHeader>

        <Body>
          <form onSubmit={handleSubmit}>

            {/* ── What are you selling ── */}
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

              {/* Availability toggle */}
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

            {/* ── Pricing ── */}
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
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </FieldSelect>
                </Field>
              </PriceRow>

              {unit === "custom" && (
                <Field>
                  <FieldLabel htmlFor="customUnit">Custom unit label</FieldLabel>
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
            </Section>

            {/* ── Details ── */}
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
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: "none" }}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </PhoneInputWrap>
                <FieldHint>Buyers will use this to contact you via WhatsApp or call.</FieldHint>
              </Field>
            </Section>

            {/* ── Photo ── */}
            <Section>
              <SectionLabel>Photo</SectionLabel>

              {preview ? (
                <PreviewWrap>
                  <PreviewImg src={preview} alt="preview" />
                  <PreviewActions>
                    {/* Clicking "Change photo" opens the file picker to replace the image */}
                    <PreviewLabel htmlFor="imageUpload">Change photo</PreviewLabel>
                    <PreviewRemove
                      type="button"
                      onClick={() => { setImage(null); setPreview(null); }}
                    >
                      Remove
                    </PreviewRemove>
                  </PreviewActions>
                </PreviewWrap>
              ) : (
                <DropZone
                  $dragOver={dragOver}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("imageUpload").click()}
                >
                  <DropIcon>📷</DropIcon>
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
                <><Spinner /> Saving changes…</>
              ) : (
                "Save Changes"
              )}
            </SubmitBtn>

          </form>
        </Body>
      </Page>
    </>
  );
}

export default EditListing;

// ─── Styled components ────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
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
  &:hover { background: #f0fdf4; }
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
  &:last-child { margin-bottom: 0; }
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

const FieldInput    = styled.input`${fieldBase}`;
const FieldTextarea = styled.textarea`${fieldBase} resize: vertical; min-height: 100px;`;
const FieldSelect   = styled.select`${fieldBase} cursor: pointer;`;

const PhoneInputWrap = styled.div`display: flex; align-items: stretch;`;
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
const FieldHint = styled.p`font-size: 0.74rem; color: #9ca3af; margin: 5px 0 0;`;

const ChipGrid = styled.div`display: flex; flex-wrap: wrap; gap: 8px;`;
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

const PriceRow = styled.div`
  display: flex;
  gap: 12px;
  @media (max-width: 400px) { flex-direction: column; }
`;

const DropZone = styled.div`
  border: 2px dashed ${({ $dragOver }) => ($dragOver ? "#2f5a2a" : "#cde5cf")};
  border-radius: 16px;
  background: ${({ $dragOver }) => ($dragOver ? "#f0fdf4" : "#fafcfa")};
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  &:hover { border-color: #2f5a2a; background: #f0fdf4; }
`;
const DropIcon = styled.div`font-size: 2rem; margin-bottom: 10px;`;
const DropText = styled.p`font-size: 0.92rem; font-weight: 700; color: #1a3318; margin: 0 0 4px;`;
const DropHint = styled.p`font-size: 0.76rem; color: #9ca3af; margin: 0;`;

const PreviewWrap = styled.div`display: flex; align-items: center; gap: 16px;`;
const PreviewImg = styled.img`
  width: 90px; height: 90px;
  object-fit: cover;
  border-radius: 14px;
  border: 1.5px solid #e8f5e9;
  flex-shrink: 0;
`;
const PreviewActions = styled.div`display: flex; flex-direction: column; gap: 8px;`;
const PreviewLabel = styled.label`
  font-size: 0.84rem; font-weight: 700; color: #2f5a2a; cursor: pointer;
  &:hover { text-decoration: underline; }
`;
const PreviewRemove = styled.button`
  background: none; border: none; padding: 0;
  font-size: 0.82rem; color: #ef4444; font-weight: 600;
  cursor: pointer; text-align: left;
  &:hover { text-decoration: underline; }
`;
const HiddenInput = styled.input`display: none;`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;
const Spinner = styled.div`
  width: 18px; height: 18px;
  border-radius: 50%;
  border: 2.5px solid rgba(255,255,255,0.3);
  border-top-color: white;
  animation: ${spin} 0.7s linear infinite;
`;

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
  transition: opacity 0.2s, transform 0.2s;
  &:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  &:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
`;
