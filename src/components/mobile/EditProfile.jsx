import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes } from "styled-components";
import { useEditProfile } from "../../hooks/useEditProfile";
import { useProfile } from "../../hooks/useProfile";
import { useAuth } from "../../context/AuthContext";
import LoadingComponent from "./Loading";

// ─── Animations ───────────────────────────────────────────────────────────────

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// ─── Page Shell ───────────────────────────────────────────────────────────────

const Container = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
  padding-bottom: 48px;
`;

// ─── Top bar ─────────────────────────────────────────────────────────────────

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e8f0e8;
  position: sticky;
  top: 0;
  z-index: 50;
`;

const BackBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #eef7ee;
  border: none;
  color: #2f5a2a;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;

  &:hover {
    background: #d7edd9;
  }
`;

const TopTitle = styled.h1`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: #1a3318;
  flex: 1;
`;

// ─── Form Card ────────────────────────────────────────────────────────────────

const FormCard = styled.form`
  max-width: 680px;
  margin: 28px auto 0;
  padding: 0 20px;
  animation: ${slideUp} 0.35s ease;
`;

// ─── Avatar Upload ────────────────────────────────────────────────────────────

// Circular avatar click-to-upload area at the top of the form
const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
`;

const AvatarWrap = styled.label`
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  cursor: pointer;
  display: block;
  flex-shrink: 0;
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  display: block;
`;

// Placeholder shown when no image is selected
const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #d7edd9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  border: 3px dashed #a8d5ac;
`;

// Camera icon overlay that appears on hover — signals the area is clickable
const CameraOverlay = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  opacity: 0;
  transition: opacity 0.2s;

  ${AvatarWrap}:hover & {
    opacity: 1;
  }
`;

const AvatarHint = styled.p`
  margin: 10px 0 0;
  color: #7b8f7f;
  font-size: 0.82rem;
`;

// Hidden file input — triggered by clicking the AvatarWrap label
const HiddenInput = styled.input`
  display: none;
`;

// ─── Section Divider ──────────────────────────────────────────────────────────

const SectionBlock = styled.div`
  background: white;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  padding: 22px;
  margin-bottom: 16px;
`;

const SectionLabel = styled.p`
  margin: 0 0 18px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #7b8f7f;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

// ─── Field ────────────────────────────────────────────────────────────────────

const Field = styled.div`
  margin-bottom: 18px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FieldLabel = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 7px;
  font-size: 0.88rem;
  font-weight: 700;
  color: #1a3318;
`;

// Character counter shown next to label on text fields with maxLength
const CharCount = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  color: ${({ $over }) => ($over ? "#c0392b" : "#7b8f7f")};
`;

const inputStyles = `
  width: 100%;
  box-sizing: border-box;
  border: 1.5px solid #dbe5d8;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 16px;
  color: #1a3318;
  background: #f8faf6;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: inherit;

  &::placeholder {
    color: #b0bfad;
  }

  &:focus {
    border-color: #2f5a2a;
    box-shadow: 0 0 0 3px rgba(47, 90, 42, 0.1);
    background: white;
  }
`;

const Input = styled.input`${inputStyles}`;

const Textarea = styled.textarea`
  ${inputStyles}
  min-height: 110px;
  resize: vertical;
  line-height: 1.6;
`;

const HelperText = styled.p`
  margin: 5px 0 0;
  font-size: 0.78rem;
  color: #7b8f7f;
  line-height: 1.5;
`;

// ─── Action Buttons ───────────────────────────────────────────────────────────

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
  padding-bottom: 12px;
`;

const CancelBtn = styled.button`
  flex: 1;
  padding: 14px;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  background: white;
  color: #2f5a2a;
  border: 2px solid #cde5cf;
  transition: all 0.2s;

  &:hover {
    background: #eef7ee;
    border-color: #2f5a2a;
  }
`;

const SaveBtn = styled.button`
  flex: 2;
  padding: 14px;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  background: #2f5a2a;
  color: white;
  border: 2px solid #2f5a2a;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: #245026;
  }

  &:disabled {
    background: #9db79b;
    border-color: #9db79b;
    cursor: not-allowed;
  }
`;

const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  display: inline-block;
  animation: ${spin} 0.7s linear infinite;
`;

// ─── Component ────────────────────────────────────────────────────────────────

const DESCRIPTION_MAX = 300;

const EditProfile = () => {
  const { mutate, isPending } = useEditProfile();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: profile, isLoading } = useProfile(user?.id);

  const [farm_name, setFarmName]         = useState("");
  const [description, setDescription]   = useState("");
  const [location, setLocation]         = useState("");
  const [location_link, setLocationLink] = useState("");
  const [image, setImage]               = useState(null);
  const [preview, setPreview]           = useState(null);

  // Pre-fill all fields with existing profile data once it loads.
  // Any field not yet set in the DB stays as an empty string (blank input).
  useEffect(() => {
    if (!profile) return;
    setFarmName(profile.farm_name || "");
    setDescription(profile.description || "");
    setLocation(profile.location || "");
    setLocationLink(profile.location_link || "");
    setPreview(profile.avatar_url || null);
  }, [profile]);

  // Stores the selected file and creates a local blob URL for the preview.
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Saves all field values to Supabase and navigates back to the profile page on success.
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(
      {
        farm_name,
        description,
        location,
        location_link,
        image,
        existingAvatarUrl: profile?.avatar_url,
      },
      { onSuccess: () => navigate("/profile") },
    );
  };

  const descOver = description.length > DESCRIPTION_MAX;

  if (isLoading) return <LoadingComponent />;

  return (
    <>
      <AppNavbar />
      <Container>

        {/* ── Sticky top bar with back button ── */}
        <TopBar>
          <BackBtn onClick={() => navigate(-1)}>←</BackBtn>
          <TopTitle>Edit Profile</TopTitle>
        </TopBar>

        <FormCard onSubmit={handleSubmit}>

          {/* ── Avatar upload — shows existing photo or placeholder, click to replace ── */}
          <AvatarSection>
            <AvatarWrap htmlFor="avatarInput">
              {preview ? (
                <AvatarImg src={preview} alt="Profile preview" />
              ) : (
                <AvatarPlaceholder>🌿</AvatarPlaceholder>
              )}
              <CameraOverlay>📷</CameraOverlay>
            </AvatarWrap>
            <AvatarHint>
              {preview ? "Tap to change photo" : "Tap to add a profile photo"}
            </AvatarHint>
            <HiddenInput
              id="avatarInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </AvatarSection>

          {/* ── Farm info section ── */}
          <SectionBlock>
            <SectionLabel>Farm Info</SectionLabel>

            <Field>
              <FieldLabel htmlFor="farmName">Farm Name</FieldLabel>
              <Input
                id="farmName"
                value={farm_name}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="e.g. Amina's Organic Farm"
                maxLength={60}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">
                Description
                <CharCount $over={descOver}>
                  {description.length}/{DESCRIPTION_MAX}
                </CharCount>
              </FieldLabel>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell buyers what you grow, your farming practices, and what makes your produce special…"
                maxLength={DESCRIPTION_MAX}
              />
            </Field>
          </SectionBlock>

          {/* ── Location section ── */}
          <SectionBlock>
            <SectionLabel>Location</SectionLabel>

            <Field>
              <FieldLabel htmlFor="location">Location</FieldLabel>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Nyamware, Kisumu, Kenya"
              />
              <HelperText>Shown on your public profile to nearby buyers.</HelperText>
            </Field>

            <Field>
              <FieldLabel htmlFor="locationLink">Google Maps Embed Link</FieldLabel>
              <Input
                id="locationLink"
                type="url"
                value={location_link}
                onChange={(e) => setLocationLink(e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=…"
              />
              {/* location_link is optional — the map won't show if empty */}
              <HelperText>
                Optional. In Google Maps → Share → Embed a map → copy the
                src="…" URL.
              </HelperText>
            </Field>
          </SectionBlock>

          {/* ── Action buttons ── */}
          <ButtonRow>
            <CancelBtn type="button" onClick={() => navigate(-1)}>
              Cancel
            </CancelBtn>
            <SaveBtn type="submit" disabled={isPending || descOver}>
              {isPending ? (
                <>
                  <Spinner />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </SaveBtn>
          </ButtonRow>

        </FormCard>
      </Container>
    </>
  );
};

export default EditProfile;
