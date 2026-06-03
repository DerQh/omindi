import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import styled, { keyframes } from "styled-components";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const CONTACT_CARDS = [
  {
    icon: "📧",
    title: "Email Us",
    value: "washingtonomindi@gmail.com",
    note: "We reply within 1–2 business days",
    action: "mailto:washingtonomindi@gmail.com",
    actionLabel: "Send email",
  },
  {
    icon: "📞",
    title: "Call Us",
    value: "+254 700 000 000",
    note: "Mon – Fri, 8 am – 5 pm EAT",
    action: "tel:+254703593485",
    actionLabel: "Call now",
  },
  {
    icon: "📍",
    title: "Location",
    value: "Ondusi, Kisumu - Kenya",
    note: "Serving farmers across the country",
    action: null,
    actionLabel: null,
  },
];

const SOCIAL_LINKS = [
  { label: "Twitter / X", href: "#", icon: "𝕏" },
  { label: "Instagram", href: "#", icon: "📸" },
  { label: "Facebook", href: "#", icon: "f" },
  { label: "LinkedIn", href: "#", icon: "in" },
];

const TOPICS = [
  { value: "account", label: "Account / Login" },
  { value: "listing", label: "Listing Help" },
  { value: "billing", label: "Billing & Plans" },
  { value: "dispute", label: "Dispute / Report" },
  { value: "wholesale", label: "Wholesale Enquiry" },
  { value: "feedback", label: "Feedback" },
  { value: "other", label: "Other" },
];

// ─── Component ────────────────────────────────────────────────────────────────

// ← Paste your Formspree form ID here after creating a form at formspree.io
const FORMSPREE_ID = "xkoawdop";

function ContactUs() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    const topicLabel =
      TOPICS.find((t) => t.value === form.subject)?.label || "General Enquiry";

    setSending(true);
    setError("");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          _replyto: form.email,
          email: form.email,
          phone: form.phone || "N/A",
          topic: topicLabel,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError(
        "Could not send your message. Please try emailing washingtonomindi@gmail.com directly.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Helmet><title>Contact Us — AFARMER™</title></Helmet>
            <Navbar />

      {/* ── Hero ── */}
      <Hero>
        <HeroBlob1 />
        <HeroBlob2 />
        <HeroInner>
          <HeroLeft>
            <Eyebrow>Get in Touch</Eyebrow>
            <HeroTitle>We'd Love to Hear From You</HeroTitle>
            <HeroSub>
              Whether you have a question about your account, need help with a
              listing, or just want to share feedback — we're here.
            </HeroSub>
            <ResponseBadge>
              <ResponseDot />
              <span>Support team online · Avg. reply in &lt;24 hours</span>
            </ResponseBadge>
          </HeroLeft>
          <HeroRight>
            <HeroImageCard>
              <img src="/farming.jpg" alt="AFARMER support" />
              <HeroImageOverlay>
                <HeroImageStat>
                  <HeroStatNum>2,000+</HeroStatNum>
                  <HeroStatLabel>Farmers helped</HeroStatLabel>
                </HeroImageStat>
                <HeroImageStat>
                  <HeroStatNum>&lt;24h</HeroStatNum>
                  <HeroStatLabel>Avg. response</HeroStatLabel>
                </HeroImageStat>
              </HeroImageOverlay>
            </HeroImageCard>
          </HeroRight>
        </HeroInner>
      </Hero>

      {/* ── Contact cards ── */}
      <CardsSection>
        <CardsInner>
          {CONTACT_CARDS.map((c) => (
            <ContactCard key={c.title}>
              <ContactCardIcon>{c.icon}</ContactCardIcon>
              <ContactCardBody>
                <ContactCardTitle>{c.title}</ContactCardTitle>
                <ContactCardValue>{c.value}</ContactCardValue>
                <ContactCardNote>{c.note}</ContactCardNote>
              </ContactCardBody>
              {c.action && (
                <ContactCardAction href={c.action}>
                  {c.actionLabel}
                </ContactCardAction>
              )}
            </ContactCard>
          ))}
        </CardsInner>
      </CardsSection>

      {/* ── Form + side info ── */}
      <FormSection>
        <FormInner>
          {/* Left: info */}
          <FormLeft>
            <FormLeftLabel>Send a Message</FormLeftLabel>
            <FormLeftTitle>How Can We Help?</FormLeftTitle>
            <FormLeftText>
              Use the form to reach us with any question or feedback. For urgent
              matters, emailing us directly gets the fastest response.
            </FormLeftText>

            <InfoList>
              {[
                "Account issues & login help",
                "Listing disputes or removals",
                "Billing & plan upgrades",
                "Partnership & wholesale enquiries",
                "General feedback & suggestions",
              ].map((item) => (
                <InfoItem key={item}>
                  <InfoCheck>✓</InfoCheck>
                  <span>{item}</span>
                </InfoItem>
              ))}
            </InfoList>

            <Divider />

            <SocialSection>
              <SocialLabel>Find us on social</SocialLabel>
              <SocialLinks>
                {SOCIAL_LINKS.map((s) => (
                  <SocialLink key={s.label} href={s.href} title={s.label}>
                    {s.icon}
                  </SocialLink>
                ))}
              </SocialLinks>
            </SocialSection>

            <FaqNote>
              Looking for quick answers?{" "}
              <FaqLink href="/faq">Browse our FAQ </FaqLink>
            </FaqNote>
          </FormLeft>

          {/* Right: form */}
          <FormRight>
            {submitted ? (
              <SuccessCard>
                <SuccessCircle>
                  <SuccessCheckmark>✓</SuccessCheckmark>
                </SuccessCircle>
                <SuccessTitle>Message Received!</SuccessTitle>
                <SuccessSub>
                  Thanks for reaching out. We'll get back to you at{" "}
                  <strong>{form.email}</strong> within 1–2 business days.
                </SuccessSub>
                <SuccessSteps>
                  <SuccessStep>
                    <SuccessStepNum>1</SuccessStepNum>
                    <SuccessStepText>
                      Check your inbox for a confirmation email
                    </SuccessStepText>
                  </SuccessStep>
                  <SuccessStep>
                    <SuccessStepNum>2</SuccessStepNum>
                    <SuccessStepText>
                      Our team reviews your message
                    </SuccessStepText>
                  </SuccessStep>
                  <SuccessStep>
                    <SuccessStepNum>3</SuccessStepNum>
                    <SuccessStepText>
                      We'll reply within 1–2 business days
                    </SuccessStepText>
                  </SuccessStep>
                </SuccessSteps>
                <SuccessBackBtn
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      subject: "",
                      message: "",
                    });
                  }}
                >
                  Send another message
                </SuccessBackBtn>
              </SuccessCard>
            ) : (
              <FormCard>
                <FormCardHeader>
                  <FormCardTitle>Send us a message</FormCardTitle>
                  <FormCardSub>All fields marked * are required.</FormCardSub>
                </FormCardHeader>
                <FormBody>
                  <form onSubmit={handleSubmit} noValidate>
                    <TwoCol>
                      <Field>
                        <FieldLabel htmlFor="firstName">
                          First Name *
                        </FieldLabel>
                        <FieldInput
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="Jane"
                          required
                          value={form.firstName}
                          onChange={handleChange}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                        <FieldInput
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Doe"
                          value={form.lastName}
                          onChange={handleChange}
                        />
                      </Field>
                    </TwoCol>

                    <TwoCol>
                      <Field>
                        <FieldLabel htmlFor="email">Email Address *</FieldLabel>
                        <FieldInput
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          required
                          value={form.email}
                          onChange={handleChange}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="phone">
                          Phone (optional)
                        </FieldLabel>
                        <FieldInput
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+254 7XX XXX XXX"
                          value={form.phone}
                          onChange={handleChange}
                        />
                      </Field>
                    </TwoCol>

                    <Field>
                      <FieldLabel htmlFor="subject">
                        What's this about?
                      </FieldLabel>
                      <TopicGrid>
                        {TOPICS.map((t) => (
                          <TopicChip
                            key={t.value}
                            type="button"
                            $active={form.subject === t.value}
                            onClick={() => {
                              setError("");
                              setForm((p) => ({ ...p, subject: t.value }));
                            }}
                          >
                            {t.label}
                          </TopicChip>
                        ))}
                      </TopicGrid>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="message">Message *</FieldLabel>
                      <FieldTextarea
                        id="message"
                        name="message"
                        rows="5"
                        placeholder="Describe how we can help you…"
                        required
                        value={form.message}
                        onChange={handleChange}
                      />
                    </Field>

                    {error && <ErrorMsg>{error}</ErrorMsg>}

                    <SubmitBtn type="submit" disabled={sending}>
                      {sending ? "Sending…" : "Send Message"}
                    </SubmitBtn>
                    <ReplyNote>
                      🔒 &nbsp;Your information is never shared with third
                      parties.
                    </ReplyNote>
                  </form>
                </FormBody>
              </FormCard>
            )}
          </FormRight>
        </FormInner>
      </FormSection>

      <FooterContainer />
    </>
  );
}

export default ContactUs;

// ─── Styled components ────────────────────────────────────────────────────────

const Hero = styled.section`
  background: linear-gradient(
    140deg,
    #0d2410 0%,
    #1a3318 40%,
    #2f5a2a 75%,
    #4e9643 100%
  );
  padding: 80px 40px 100px;
  position: relative;
  overflow: hidden;
  @media (max-width: 900px) {
    padding: 72px 24px 90px;
  }
`;
const HeroBlob1 = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: rgba(78, 150, 67, 0.1);
  top: -160px;
  right: -120px;
  pointer-events: none;
`;
const HeroBlob2 = styled.div`
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  bottom: -80px;
  left: -60px;
  pointer-events: none;
`;
const HeroInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 1;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;
const HeroLeft = styled.div`
  animation: ${fadeUp} 0.6s ease;
`;
const Eyebrow = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 6px 16px;
  border-radius: 999px;
  margin-bottom: 20px;
`;
const HeroTitle = styled.h1`
  font-size: clamp(1.9rem, 4vw, 2.8rem);
  font-weight: 900;
  color: white;
  letter-spacing: -0.4px;
  margin: 0 0 16px;
  line-height: 1.15;
`;
const HeroSub = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.75;
  margin: 0 0 24px;
`;
const ResponseBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
`;
const ResponseDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.25);
`;
const HeroRight = styled.div`
  animation: ${fadeUp} 0.7s ease 0.1s both;
  @media (max-width: 900px) {
    display: none;
  }
`;
const HeroImageCard = styled.div`
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  img {
    width: 100%;
    height: 320px;
    object-fit: cover;
    display: block;
  }
`;
const HeroImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(10, 30, 10, 0.85), transparent);
  padding: 24px;
  display: flex;
  gap: 24px;
`;
const HeroImageStat = styled.div``;
const HeroStatNum = styled.div`
  font-size: 1.4rem;
  font-weight: 900;
  color: white;
`;
const HeroStatLabel = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 500;
`;

// Cards
const CardsSection = styled.section`
  background: #f5f8f5;
  padding: 0 24px;
`;
const CardsInner = styled.div`
  max-width: 960px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  transform: translateY(-40px);
`;
const ContactCard = styled.div`
  background: white;
  border-radius: 18px;
  padding: 26px 22px;
  border: 1px solid #e8f5e9;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 32px rgba(20, 57, 32, 0.12);
  }
`;
const ContactCardIcon = styled.div`
  font-size: 1.7rem;
  margin-bottom: 8px;
`;
const ContactCardBody = styled.div`
  flex: 1;
`;
const ContactCardTitle = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #9ca3af;
  margin-bottom: 5px;
`;
const ContactCardValue = styled.div`
  font-size: 0.95rem;
  font-weight: 800;
  color: #1a3318;
  margin-bottom: 3px;
`;
const ContactCardNote = styled.div`
  font-size: 0.78rem;
  color: #9ca3af;
  margin-bottom: 14px;
`;
const ContactCardAction = styled.a`
  font-size: 0.82rem;
  font-weight: 700;
  color: #2f5a2a;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

// Form section
const FormSection = styled.section`
  background: #f5f8f5;
  padding: 0 24px 88px;
`;
const FormInner = styled.div`
  max-width: 1040px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 56px;
  align-items: start;
  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;
const FormLeft = styled.div`
  padding-top: 8px;
`;
const FormLeftLabel = styled.p`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #4e9643;
  margin: 0 0 10px;
`;
const FormLeftTitle = styled.h2`
  font-size: clamp(1.4rem, 2vw, 1.8rem);
  font-weight: 900;
  color: #1a3318;
  margin: 0 0 14px;
  letter-spacing: -0.3px;
`;
const FormLeftText = styled.p`
  font-size: 0.93rem;
  color: #4b5563;
  line-height: 1.75;
  margin: 0 0 24px;
`;
const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const InfoItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.9rem;
  color: #374151;
  font-weight: 500;
  line-height: 1.4;
`;
const InfoCheck = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  color: #16a34a;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  flex-shrink: 0;
  margin-top: 1px;
`;
const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 24px 0;
`;
const SocialSection = styled.div`
  margin-bottom: 20px;
`;
const SocialLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #9ca3af;
  margin: 0 0 12px;
`;
const SocialLinks = styled.div`
  display: flex;
  gap: 10px;
`;
const SocialLink = styled.a`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: white;
  border: 1.5px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 800;
  color: #374151;
  text-decoration: none;
  transition: all 0.15s;
  font-style: normal;
  &:hover {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: #2f5a2a;
  }
`;
const FaqNote = styled.p`
  font-size: 0.88rem;
  color: #6b7280;
  margin: 0;
`;
const FaqLink = styled.a`
  color: #2f5a2a;
  font-weight: 700;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

// Form card
const FormRight = styled.div``;
const FormCard = styled.div`
  background: white;
  border-radius: 22px;
  padding: 0;
  box-shadow: 0 6px 30px rgba(20, 57, 32, 0.09);
  border: 1px solid #e8f5e9;
  overflow: hidden;
`;
const FormCardHeader = styled.div`
  padding: 24px 32px;
  background: linear-gradient(135deg, #f8faf6, #f0f7ee);
  border-bottom: 1px solid #e8f5e9;
`;
const FormCardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 4px;
`;
const FormCardSub = styled.p`
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0;
`;

const FormBody = styled.div`
  padding: 28px 32px;
`;
const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;
const Field = styled.div`
  margin: 0 0 16px;
`;
const FieldLabel = styled.label`
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  color: #1a3318;
  margin-bottom: 6px;
`;

const fieldBase = `
  width: 100%; padding: 11px 14px; border-radius: 10px;
  border: 1.5px solid #e5e7eb; font-size: 16px;
  color: #111827; background: #fafcfa; outline: none;
  box-sizing: border-box; transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit;
  &:focus { border-color: #2f5a2a; background: white; box-shadow: 0 0 0 3px rgba(47,90,42,0.08); }
  &::placeholder { color: #d1d5db; }
`;

const FieldInput = styled.input`
  ${fieldBase}
`;
const FieldTextarea = styled.textarea`
  ${fieldBase} resize: vertical;
`;

// Topic chips
const TopicGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px 0;
`;
const TopicChip = styled.button`
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  border: 1.5px solid;
  background: ${({ $active }) => ($active ? "#2f5a2a" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#4b5563")};
  border-color: ${({ $active }) => ($active ? "#2f5a2a" : "#e5e7eb")};
  &:hover {
    background: ${({ $active }) => ($active ? "#245026" : "#f0fdf4")};
    border-color: ${({ $active }) => ($active ? "#245026" : "#bbf7d0")};
  }
`;

const ErrorMsg = styled.p`
  font-size: 0.82rem;
  color: #ef4444;
  font-weight: 600;
  margin: 0 0 14px;
  padding: 10px 14px;
  background: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
`;
const SubmitBtn = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2f5a2a, #4e9643);
  color: white;
  border: none;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.2s;
  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const ReplyNote = styled.p`
  text-align: center;
  font-size: 0.76rem;
  color: #9ca3af;
  margin: 12px 0 0;
`;

const SuccessCard = styled.div`
  background: white;
  border-radius: 22px;
  padding: 52px 32px;
  text-align: center;
  border: 1px solid #d1fae5;
  box-shadow: 0 6px 30px rgba(20, 57, 32, 0.09);
  animation: ${popIn} 0.3s ease;
`;
const SuccessCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2f5a2a, #4e9643);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
  box-shadow: 0 8px 24px rgba(47, 90, 42, 0.25);
`;
const SuccessCheckmark = styled.span`
  color: white;
  font-size: 1.8rem;
  line-height: 1;
`;
const SuccessTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 900;
  color: #1a3318;
  margin: 0 0 10px;
  letter-spacing: -0.3px;
`;
const SuccessSub = styled.p`
  font-size: 0.92rem;
  color: #6b7280;
  line-height: 1.7;
  margin: 0 0 28px;
  strong {
    color: #1a3318;
  }
`;
const SuccessSteps = styled.div`
  text-align: left;
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const SuccessStep = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;
const SuccessStepNum = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  color: #2f5a2a;
  font-size: 0.78rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
const SuccessStepText = styled.span`
  font-size: 0.88rem;
  color: #4b5563;
  font-weight: 500;
`;
const SuccessBackBtn = styled.button`
  background: none;
  border: 1.5px solid #2f5a2a;
  color: #2f5a2a;
  padding: 10px 24px;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: #2f5a2a;
    color: white;
  }
`;
