import { useState } from "react";
import styled, { keyframes } from "styled-components";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Contact info ─────────────────────────────────────────────────────────────

const CONTACT_CARDS = [
  {
    icon: "📧",
    title: "Email Us",
    value: "hello@afarmer.co.ke",
    note: "We reply within 1–2 business days",
  },
  {
    icon: "📞",
    title: "Call Us",
    value: "+254 700 000 000",
    note: "Mon – Fri, 8 am – 5 pm EAT",
  },
  {
    icon: "📍",
    title: "Location",
    value: "Kisumu, Kenya",
    note: "Serving farmers across the country",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

function ContactUs() {
  const [form, setForm]         = useState({ firstName: "", lastName: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState("");

  const handleChange = (e) => {
    setError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    console.log("Contact form submitted:", form);
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <Hero>
        <HeroInner>
          <Eyebrow>Get in Touch</Eyebrow>
          <HeroTitle>We'd Love to Hear From You</HeroTitle>
          <HeroSub>
            Whether you have a question about your account, need help with a
            listing, or just want to share feedback — we're here.
          </HeroSub>
        </HeroInner>
      </Hero>

      {/* ── Contact cards ── */}
      <CardsSection>
        <CardsInner>
          {CONTACT_CARDS.map((c) => (
            <ContactCard key={c.title}>
              <ContactCardIcon>{c.icon}</ContactCardIcon>
              <ContactCardTitle>{c.title}</ContactCardTitle>
              <ContactCardValue>{c.value}</ContactCardValue>
              <ContactCardNote>{c.note}</ContactCardNote>
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
              Use the form to reach us with any question or feedback. For
              urgent matters, emailing us directly gets the fastest response.
            </FormLeftText>

            <InfoList>
              <InfoItem>
                <InfoDot />
                <span>Account issues & login help</span>
              </InfoItem>
              <InfoItem>
                <InfoDot />
                <span>Listing disputes or removals</span>
              </InfoItem>
              <InfoItem>
                <InfoDot />
                <span>Billing & plan upgrades</span>
              </InfoItem>
              <InfoItem>
                <InfoDot />
                <span>Partnership & wholesale enquiries</span>
              </InfoItem>
              <InfoItem>
                <InfoDot />
                <span>General feedback & suggestions</span>
              </InfoItem>
            </InfoList>

            <FaqNote>
              Looking for quick answers?{" "}
              <FaqLink href="/faq">Browse our FAQ</FaqLink>
            </FaqNote>
          </FormLeft>

          {/* Right: form */}
          <FormRight>
            {submitted ? (
              <SuccessCard>
                <SuccessIcon>✅</SuccessIcon>
                <SuccessTitle>Message Sent!</SuccessTitle>
                <SuccessSub>
                  Thanks for reaching out. We'll get back to you at{" "}
                  <strong>{form.email}</strong> within 1–2 business days.
                </SuccessSub>
              </SuccessCard>
            ) : (
              <FormCard>
                <form onSubmit={handleSubmit} noValidate>
                  <TwoCol>
                    <Field>
                      <FieldLabel htmlFor="firstName">First Name *</FieldLabel>
                      <FieldInput
                        id="firstName" name="firstName" type="text"
                        placeholder="Jane" required
                        value={form.firstName} onChange={handleChange}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                      <FieldInput
                        id="lastName" name="lastName" type="text"
                        placeholder="Doe"
                        value={form.lastName} onChange={handleChange}
                      />
                    </Field>
                  </TwoCol>

                  <Field>
                    <FieldLabel htmlFor="email">Email Address *</FieldLabel>
                    <FieldInput
                      id="email" name="email" type="email"
                      placeholder="you@example.com" required
                      value={form.email} onChange={handleChange}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="subject">Subject</FieldLabel>
                    <FieldSelect
                      id="subject" name="subject"
                      value={form.subject} onChange={handleChange}
                    >
                      <option value="">Select a topic…</option>
                      <option value="account">Account / Login</option>
                      <option value="listing">Listing Help</option>
                      <option value="billing">Billing & Plans</option>
                      <option value="dispute">Dispute / Report</option>
                      <option value="wholesale">Wholesale Enquiry</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </FieldSelect>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="message">Message *</FieldLabel>
                    <FieldTextarea
                      id="message" name="message" rows="5"
                      placeholder="Describe how we can help you…"
                      required value={form.message} onChange={handleChange}
                    />
                  </Field>

                  {error && <ErrorMsg>{error}</ErrorMsg>}

                  <SubmitBtn type="submit">Send Message</SubmitBtn>
                  <ReplyNote>We typically reply within 1–2 business days.</ReplyNote>
                </form>
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
  background: linear-gradient(140deg, #1a3318 0%, #2f5a2a 55%, #4e9643 100%);
  padding: 80px 24px 100px; text-align: center;
  position: relative; overflow: hidden;
  &::before {
    content: ""; position: absolute; width: 400px; height: 400px;
    border-radius: 50%; background: rgba(255,255,255,0.04);
    top: -120px; right: -80px;
  }
`;
const HeroInner = styled.div`
  max-width: 600px; margin: 0 auto;
  position: relative; z-index: 1;
  animation: ${fadeUp} 0.6s ease;
`;
const Eyebrow = styled.span`
  display: inline-block;
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25);
  color: rgba(255,255,255,0.9); font-size: 0.75rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  padding: 6px 16px; border-radius: 999px; margin-bottom: 18px;
`;
const HeroTitle = styled.h1`
  font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800; color: white;
  letter-spacing: -0.4px; margin: 0 0 14px; line-height: 1.2;
`;
const HeroSub = styled.p`
  font-size: 1rem; color: rgba(255,255,255,0.78); line-height: 1.7; margin: 0;
`;

// ── Contact cards ──

const CardsSection = styled.section`
  background: #f5f8f5; padding: 0 24px 0; margin-top: -1px;
`;
const CardsInner = styled.div`
  max-width: 900px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px; transform: translateY(-36px);
`;
const ContactCard = styled.div`
  background: white; border-radius: 18px; padding: 28px 24px;
  border: 1px solid #e8f5e9; text-align: center;
  box-shadow: 0 4px 20px rgba(20,57,32,0.08);
`;
const ContactCardIcon  = styled.div`font-size: 1.8rem; margin-bottom: 12px;`;
const ContactCardTitle = styled.div`
  font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: #9ca3af; margin-bottom: 6px;
`;
const ContactCardValue = styled.div`
  font-size: 0.95rem; font-weight: 800; color: #1a3318; margin-bottom: 4px;
`;
const ContactCardNote  = styled.div`font-size: 0.78rem; color: #9ca3af;`;

// ── Form section ──

const FormSection = styled.section`
  background: #f5f8f5; padding: 0 24px 80px;
`;
const FormInner = styled.div`
  max-width: 960px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 1.2fr;
  gap: 56px; align-items: start;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;
const FormLeft = styled.div`padding-top: 8px;`;
const FormLeftLabel = styled.p`
  font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; color: #4e9643; margin: 0 0 10px;
`;
const FormLeftTitle = styled.h2`
  font-size: clamp(1.4rem, 2vw, 1.8rem); font-weight: 800;
  color: #1a3318; margin: 0 0 14px; letter-spacing: -0.3px;
`;
const FormLeftText = styled.p`
  font-size: 0.93rem; color: #4b5563; line-height: 1.75; margin: 0 0 24px;
`;
const InfoList = styled.ul`
  list-style: none; padding: 0; margin: 0 0 24px;
  display: flex; flex-direction: column; gap: 10px;
`;
const InfoItem = styled.li`
  display: flex; align-items: center; gap: 10px;
  font-size: 0.9rem; color: #374151; font-weight: 500;
`;
const InfoDot = styled.div`
  width: 8px; height: 8px; border-radius: 50%;
  background: #4e9643; flex-shrink: 0;
`;
const FaqNote = styled.p`font-size: 0.88rem; color: #6b7280; margin: 0;`;
const FaqLink = styled.a`
  color: #2f5a2a; font-weight: 700; text-decoration: none;
  &:hover { text-decoration: underline; }
`;

const FormRight = styled.div``;
const FormCard = styled.div`
  background: white; border-radius: 20px; padding: 36px 32px;
  box-shadow: 0 4px 24px rgba(20,57,32,0.08); border: 1px solid #e8f5e9;
`;
const TwoCol = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;
const Field = styled.div`margin-bottom: 16px;`;
const FieldLabel = styled.label`
  display: block; font-size: 0.82rem; font-weight: 700;
  color: #1a3318; margin-bottom: 6px;
`;

const fieldBase = `
  width: 100%; padding: 11px 14px; border-radius: 10px;
  border: 1.5px solid #e5e7eb; font-size: 0.9rem;
  color: #111827; background: #fafcfa; outline: none;
  box-sizing: border-box; transition: border-color 0.15s; font-family: inherit;
  &:focus { border-color: #2f5a2a; background: white; }
  &::placeholder { color: #d1d5db; }
`;

const FieldInput    = styled.input`${fieldBase}`;
const FieldTextarea = styled.textarea`${fieldBase} resize: vertical;`;
const FieldSelect   = styled.select`${fieldBase} cursor: pointer;`;

const ErrorMsg  = styled.p`
  font-size: 0.82rem; color: #ef4444; font-weight: 600;
  margin: 0 0 14px; padding: 10px 14px; background: #fef2f2;
  border-radius: 8px; border: 1px solid #fecaca;
`;
const SubmitBtn = styled.button`
  width: 100%; padding: 13px; border-radius: 12px;
  background: #2f5a2a; color: white; border: none;
  font-size: 0.95rem; font-weight: 800; cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #245026; }
`;
const ReplyNote = styled.p`
  text-align: center; font-size: 0.78rem; color: #9ca3af;
  margin: 10px 0 0;
`;

const SuccessCard = styled.div`
  background: white; border-radius: 20px; padding: 56px 32px;
  text-align: center; border: 1px solid #d1fae5;
  box-shadow: 0 4px 24px rgba(20,57,32,0.08);
`;
const SuccessIcon  = styled.div`font-size: 2.5rem; margin-bottom: 14px;`;
const SuccessTitle = styled.h3`
  font-size: 1.25rem; font-weight: 800; color: #1a3318; margin: 0 0 10px;
`;
const SuccessSub = styled.p`
  font-size: 0.92rem; color: #6b7280; line-height: 1.7; margin: 0;
`;
