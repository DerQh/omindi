import { useState, useEffect } from "react";
import SEO from "./SEO";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../../supabase";
import { Leaf, Lock, MapPin, Mail, PartyPopper, AlertTriangle } from "lucide-react";

// ─── Eye icons for the password toggle ───────────────────────────────────────

const EyeOpen = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosed = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// ─── Page layout ─────────────────────────────────────────────────────────────
// Two-column on desktop: branded left panel + form right panel
// Collapses to single column (form only) on mobile

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

// ─── Left panel — brand + trust signals ──────────────────────────────────────

const LeftPanel = styled.div`
  background: linear-gradient(
    145deg,
    #0f2210 0%,
    #1e3d1a 40%,
    #2f5a2a 80%,
    #3d7a35 100%
  );
  padding: 48px 52px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  /* Decorative circles */
  &::before {
    content: "";
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    top: -120px;
    right: -120px;
    pointer-events: none;
  }
  &::after {
    content: "";
    position: absolute;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    bottom: -60px;
    left: -60px;
    pointer-events: none;
  }

  @media (max-width: 860px) {
    display: none;
  }
`;

const LeftLogo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  position: relative;
  z-index: 1;

  img {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const LeftLogoText = styled.span`
  font-size: 1.1rem;
  font-weight: 900;
  color: white;
  letter-spacing: -0.5px;
`;

const LeftBody = styled.div`
  position: relative;
  z-index: 1;
`;

const LeftHeadline = styled.h2`
  margin: 0 0 14px;
  font-size: clamp(1.6rem, 2.4vw, 2rem);
  font-weight: 900;
  color: white;
  letter-spacing: -0.04em;
  line-height: 1.15;
`;

const LeftSub = styled.p`
  margin: 0 0 40px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.95rem;
  line-height: 1.7;
`;

// Trust signal rows shown on the left panel
const TrustList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const TrustItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
`;

const TrustIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
`;

const TrustText = styled.div``;

const TrustTitle = styled.p`
  margin: 0 0 2px;
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
`;

const TrustDesc = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.5;
`;

// Stat chips at the bottom of the left panel
const StatRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
`;

const StatChip = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  padding: 7px 16px;
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
`;

// ─── Right panel — form ───────────────────────────────────────────────────────

const RightPanel = styled.div`
  background: #f5f8f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
  min-height: 100vh;

  @media (max-width: 480px) {
    padding: 32px 20px;
  }
`;

// Mobile-only logo — hidden on desktop (left panel has it)
const MobileLogo = styled(Link)`
  display: none;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  margin-bottom: 28px;

  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }

  span {
    font-size: 1.05rem;
    font-weight: 900;
    color: #2f5a2a;
  }

  @media (max-width: 860px) {
    display: flex;
  }
`;

const FormCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(20, 57, 32, 0.09);
  padding: 40px;
  width: 100%;
  max-width: 420px;
  animation: ${fadeUp} 0.4s ease;

  @media (max-width: 480px) {
    padding: 28px 22px;
  }
`;

const FormHeader = styled.div`
  margin-bottom: 28px;
`;

const FormTitle = styled.h2`
  margin: 0 0 6px;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a2e1a;
  letter-spacing: -0.03em;
`;

const FormSub = styled.p`
  margin: 0;
  color: #7b8f7f;
  font-size: 0.88rem;
`;

// ─── Mode switcher tabs ───────────────────────────────────────────────────────

const ModeTabs = styled.div`
  display: flex;
  background: #f0f7ee;
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 28px;
`;

const ModeTab = styled.button`
  flex: 1;
  padding: 9px;
  border-radius: 7px;
  border: none;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $active }) => ($active ? "white" : "transparent")};
  color: ${({ $active }) => ($active ? "#2f5a2a" : "#7b8f7f")};
  box-shadow: ${({ $active }) =>
    $active ? "0 2px 8px rgba(0,0,0,0.08)" : "none"};
`;

// ─── Input fields ─────────────────────────────────────────────────────────────

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

const FieldLabel = styled.label`
  font-size: 0.78rem;
  font-weight: 700;
  color: #1a2e1a;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const InputWrap = styled.div`
  position: relative;
`;

// $hasError uses the $ prefix to avoid forwarding to the DOM element
const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 16px;
  padding-right: ${({ $hasToggle }) => ($hasToggle ? "44px" : "16px")};
  border: 1.5px solid ${({ $hasError }) => ($hasError ? "#dc3545" : "#d7edd9")};
  border-radius: 11px;
  font-size: 16px;
  color: #1a2e1a;
  background: ${({ $hasError }) => ($hasError ? "#fff5f5" : "#f8faf6")};
  outline: none;
  font-family: inherit;
  transition:
    border-color 0.15s,
    box-shadow 0.15s,
    background 0.15s;

  &::placeholder {
    color: #aac4aa;
  }

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? "#dc3545" : "#2f5a2a")};
    background: white;
    box-shadow: 0 0 0 3px
      ${({ $hasError }) =>
        $hasError ? "rgba(220,53,69,0.1)" : "rgba(47,90,42,0.1)"};
  }
`;

// Show/hide password toggle button inside the input
const ToggleBtn = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #aac4aa;
  cursor: pointer;
  padding: 4px;
  font-size: 1rem;
  line-height: 1;
  transition: color 0.15s;

  &:hover {
    color: #2f5a2a;
  }
`;

const FieldError = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: #dc3545;
  display: flex;
  align-items: center;
  gap: 4px;
`;

// ─── Inline row: Remember me + Forgot password ────────────────────────────────

const LoginExtras = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const RememberRow = styled.label`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.82rem;
  color: #556652;
  cursor: pointer;

  input {
    width: 15px;
    height: 15px;
    accent-color: #2f5a2a;
  }
`;

const ForgotLink = styled.a`
  font-size: 0.82rem;
  font-weight: 700;
  color: #2f5a2a;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

// ─── Submit button ────────────────────────────────────────────────────────────

const SubmitBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #2f5a2a;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition:
    background 0.18s,
    transform 0.12s;
  margin-top: 4px;

  &:hover:not(:disabled) {
    background: #1e3d1a;
    transform: translateY(-1px);
  }
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  display: inline-block;
`;

// ─── Error banner ─────────────────────────────────────────────────────────────

const ErrorBanner = styled.div`
  background: #fdf0f0;
  border: 1px solid #f5c6c2;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 0.85rem;
  color: #a32d2d;
  font-weight: 500;
`;

// ─── Success state shown after signup ────────────────────────────────────────

const SuccessCard = styled.div`
  text-align: center;
  padding: 16px 0;
  animation: ${fadeUp} 0.3s ease;
`;

const SuccessIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 14px;
`;

const SuccessTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 1.2rem;
  font-weight: 800;
  color: #1a2e1a;
`;

const SuccessDesc = styled.p`
  margin: 0 0 20px;
  color: #7b8f7f;
  font-size: 0.88rem;
  line-height: 1.6;
`;

const SuccessBtn = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 11px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #1e3d1a;
  }
`;

// ─── Divider + toggle ────────────────────────────────────────────────────────

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 22px 0;
  color: #aac4aa;
  font-size: 0.78rem;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e8f0e8;
  }
`;

const ToggleText = styled.p`
  text-align: center;
  margin: 0;
  font-size: 0.85rem;
  color: #7b8f7f;

  button {
    background: none;
    border: none;
    color: #2f5a2a;
    font-weight: 700;
    cursor: pointer;
    font-size: inherit;
    padding: 0;
    margin-left: 4px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const BackToHome = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 20px;
  font-size: 0.82rem;
  color: #7b8f7f;
  text-decoration: none;

  &:hover {
    color: #2f5a2a;
  }
`;

// ─── Trust signals data ───────────────────────────────────────────────────────

const TRUST = [
  {
    Icon: Leaf,
    title: "Connect directly with farmers",
    desc: "No middlemen — buy and sell fresh produce at fair prices.",
  },
  {
    Icon: Lock,
    title: "Your data is secure",
    desc: "We use industry-standard encryption to protect your account.",
  },
  {
    Icon: MapPin,
    title: "Local and nationwide",
    desc: "Find farms within your area or source from across Kenya.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
// Handles both Sign In and Sign Up in one component — toggled by isLogin state.
// All validation runs client-side before calling Supabase auth.

function SignupLogin() {
  const navigate = useNavigate();
  const { login, signup, user } = useAuth();

  useEffect(() => {
    if (user) navigate("/mobile", { replace: true });
  }, [user, navigate]);

  const [isLogin, setIsLogin] = useState(true);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    // Clear the error for this field as soon as the user starts correcting it
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!isLogin && !formData.username.trim())
      e.username = "Full name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      e.email = "Enter a valid email";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 6) e.password = "At least 6 characters";
    if (!isLogin) {
      if (!formData.confirmPassword)
        e.confirmPassword = "Please confirm your password";
      else if (formData.password !== formData.confirmPassword)
        e.confirmPassword = "Passwords do not match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate("/mobile");
      } else {
        await signup(formData.email, formData.password, formData.username);
        setSignupSuccess(true);
      }
    } catch (err) {
      setErrors({
        submit: err?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sends a password reset email via Supabase auth and shows the confirmation state.
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setForgotSent(true);
    setForgotLoading(false);
  };

  const switchMode = () => {
    setIsLogin((p) => !p);
    setFormData({ username: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
    setSignupSuccess(false);
  };

  // Show forgot password overlay instead of the normal form.
  if (forgotMode) {
    return (
      <Page>
        <LeftPanel>
          <LeftLogo to="/">
            <img src="/afarmer.webp" alt="Afarmer™ logo" loading="lazy" />
            <LeftLogoText>AFARMER™</LeftLogoText>
          </LeftLogo>
        </LeftPanel>
        <RightPanel>
          <FormCard>
            <FormHeader>
              <FormTitle>Reset Password</FormTitle>
              <FormSub>
                Enter your email and we'll send you a reset link.
              </FormSub>
            </FormHeader>
            {forgotSent ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ marginBottom: 12 }}><Mail size={40} color="#4a7c45" /></div>
                <p
                  style={{ fontWeight: 700, color: "#1a3318", marginBottom: 8 }}
                >
                  Check your inbox
                </p>
                <p
                  style={{
                    color: "#7b8f7f",
                    fontSize: "0.9rem",
                    marginBottom: 24,
                  }}
                >
                  A reset link was sent to <strong>{forgotEmail}</strong>
                </p>
                <SubmitBtn
                  type="button"
                  onClick={() => {
                    setForgotMode(false);
                    setForgotSent(false);
                  }}
                >
                  Back to Sign In
                </SubmitBtn>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <Field>
                  <FieldLabel htmlFor="forgotEmail">Email Address</FieldLabel>
                  <Input
                    id="forgotEmail"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                  />
                </Field>
                <SubmitBtn
                  type="submit"
                  disabled={forgotLoading}
                  style={{ marginTop: 16 }}
                >
                  {forgotLoading ? "Sending…" : "Send Reset Link"}
                </SubmitBtn>
                <div style={{ textAlign: "center", marginTop: 14 }}>
                  <ForgotLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setForgotMode(false);
                    }}
                  >
                    Back to Sign In
                  </ForgotLink>
                </div>
              </form>
            )}
          </FormCard>
        </RightPanel>
      </Page>
    );
  }

  return (
    <Page>
      {/* ── Left panel — brand + trust signals ── */}
      <LeftPanel>
        <LeftLogo to="/">
          <img src="/afarmer.webp" alt="Afarmer™ logo" loading="lazy" />
          <LeftLogoText>AFARMER™</LeftLogoText>
        </LeftLogo>

        <LeftBody>
          <LeftHeadline>
            The marketplace for
            <br />
            local food & farms
          </LeftHeadline>
          <LeftSub>
            Join thousands of Kenyan farmers and buyers connecting directly — no
            middlemen, no markup.
          </LeftSub>
          <TrustList>
            {TRUST.map((t) => (
              <TrustItem key={t.title}>
                <TrustIcon><t.Icon size={22} /></TrustIcon>
                <TrustText>
                  <TrustTitle>{t.title}</TrustTitle>
                  <TrustDesc>{t.desc}</TrustDesc>
                </TrustText>
              </TrustItem>
            ))}
          </TrustList>
        </LeftBody>

        <StatRow>
          <StatChip>500+ Farms</StatChip>
          <StatChip>12K+ Buyers</StatChip>
          <StatChip>30+ Counties</StatChip>
        </StatRow>
      </LeftPanel>

      {/* ── Right panel — form ── */}
      <RightPanel>
        {/* Logo shown only on mobile (left panel is hidden) */}
        <MobileLogo to="/">
          <img src="/afarmer.webp" alt="Afarmer™ logo" loading="lazy" />
          <span>AFARMER™</span>
        </MobileLogo>

        <FormCard>
          {signupSuccess ? (
            // Success state — replaces the form after a successful signup
            <SuccessCard>
              <SuccessIcon><PartyPopper size={40} color="#4a7c45" /></SuccessIcon>
              <SuccessTitle>Account created!</SuccessTitle>
              <SuccessDesc>
                Check your email to confirm your account, then sign in to start
                connecting with farmers and buyers.
              </SuccessDesc>
              <SuccessBtn
                onClick={() => {
                  setSignupSuccess(false);
                  setIsLogin(true);
                }}
              >
                Go to Sign In →
              </SuccessBtn>
            </SuccessCard>
          ) : (
            <>
              <FormHeader>
                <FormTitle>
                  {isLogin ? "Welcome back" : "Create account"}
                </FormTitle>
                <FormSub>
                  {isLogin
                    ? "Sign in to your Afarmer™ account"
                    : "Join the Afarmer™ community today — it's free"}
                </FormSub>
              </FormHeader>

              {/* Tab switcher: Sign In | Sign Up */}
              <ModeTabs>
                <ModeTab
                  $active={isLogin}
                  onClick={() => {
                    if (!isLogin) switchMode();
                  }}
                >
                  Sign In
                </ModeTab>
                <ModeTab
                  $active={!isLogin}
                  onClick={() => {
                    if (isLogin) switchMode();
                  }}
                >
                  Sign Up
                </ModeTab>
              </ModeTabs>

              {/* Global error banner */}
              {errors.submit && <ErrorBanner><AlertTriangle size={14} style={{marginRight:6,verticalAlign:"middle"}} />{errors.submit}</ErrorBanner>}

              <form onSubmit={handleSubmit}>
                {/* Full name — signup only */}
                {!isLogin && (
                  <Field>
                    <FieldLabel htmlFor="username">Full Name *</FieldLabel>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="e.g. Kevin Otieno"
                      $hasError={!!errors.username}
                      required
                    />
                    {errors.username && (
                      <FieldError><AlertTriangle size={12} style={{marginRight:4,verticalAlign:"middle"}} />{errors.username}</FieldError>
                    )}
                  </Field>
                )}

                {/* Email */}
                <Field>
                  <FieldLabel htmlFor="email">Email Address *</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    $hasError={!!errors.email}
                    required
                  />
                  {errors.email && <FieldError><AlertTriangle size={12} style={{marginRight:4,verticalAlign:"middle"}} />{errors.email}</FieldError>}
                </Field>

                {/* Password */}
                <Field>
                  <FieldLabel htmlFor="password">Password *</FieldLabel>
                  <InputWrap>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={
                        isLogin ? "Your password" : "Min. 6 characters"
                      }
                      $hasError={!!errors.password}
                      $hasToggle
                      required
                    />
                    <ToggleBtn
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeClosed /> : <EyeOpen />}
                    </ToggleBtn>
                  </InputWrap>
                  {errors.password && (
                    <FieldError><AlertTriangle size={12} style={{marginRight:4,verticalAlign:"middle"}} />{errors.password}</FieldError>
                  )}
                </Field>

                {/* Confirm password — signup only */}
                {!isLogin && (
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password *
                    </FieldLabel>
                    <InputWrap>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repeat your password"
                        $hasError={!!errors.confirmPassword}
                        $hasToggle
                        required
                      />
                      <ToggleBtn
                        type="button"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? <EyeClosed /> : <EyeOpen />}
                      </ToggleBtn>
                    </InputWrap>
                    {errors.confirmPassword && (
                      <FieldError><AlertTriangle size={12} style={{marginRight:4,verticalAlign:"middle"}} />{errors.confirmPassword}</FieldError>
                    )}
                  </Field>
                )}

                {/* Remember me + Forgot password — login only, same row */}
                {isLogin && (
                  <LoginExtras>
                    <RememberRow>
                      <input type="checkbox" id="remember" name="remember" />
                      Remember me
                    </RememberRow>
                    <ForgotLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setForgotMode(true);
                      }}
                    >
                      Forgot password?
                    </ForgotLink>
                  </LoginExtras>
                )}

                <SubmitBtn type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Spinner />{" "}
                      {isLogin ? "Signing in…" : "Creating account…"}
                    </>
                  ) : isLogin ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </SubmitBtn>
              </form>

              <Divider>or</Divider>

              <ToggleText>
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button type="button" onClick={switchMode}>
                  {isLogin ? "Sign up free" : "Sign in"}
                </button>
              </ToggleText>
            </>
          )}
        </FormCard>

        <BackToHome to="/">Back to home</BackToHome>
      </RightPanel>
    </Page>
  );
}

export default SignupLogin;
