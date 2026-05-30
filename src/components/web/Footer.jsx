import { useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Footer shell ─────────────────────────────────────────────────────────────

const FooterWrap = styled.footer`
  background: #1a2e1a;
  color: rgba(255, 255, 255, 0.75);
  font-family: inherit;
`;

// ─── Main content ─────────────────────────────────────────────────────────────

const Main = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 64px 32px 48px;
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 48px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr 1fr;
    gap: 36px;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 48px 20px 36px;
  }
`;

// ─── Brand column ─────────────────────────────────────────────────────────────

const BrandCol = styled.div``;

const LogoRow = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  margin-bottom: 16px;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const LogoText = styled.span`
  font-size: 1.1rem;
  font-weight: 900;
  color: white;
  letter-spacing: -0.5px;
`;

const BrandDesc = styled.p`
  margin: 0 0 24px;
  font-size: 0.88rem;
  line-height: 1.7;
  max-width: 280px;
`;

// Newsletter subscribe
const NewsLabel = styled.p`
  margin: 0 0 10px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.5);
`;

const InputRow = styled.form`
  display: flex;
  gap: 8px;
`;

const EmailInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 10px 14px;
  border-radius: 9px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.08);
  color: white;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s, background 0.15s;

  &::placeholder { color: rgba(255,255,255,0.35); }
  &:focus {
    border-color: rgba(255,255,255,0.35);
    background: rgba(255,255,255,0.12);
  }
`;

const SubBtn = styled.button`
  background: #3d7a35;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 9px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover { background: #2f5a2a; }
`;

const SubSuccess = styled.p`
  margin: 8px 0 0;
  font-size: 0.78rem;
  color: #6fcf6f;
  font-weight: 600;
`;

// Social icons
const SocialRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const SocialBtn = styled.a`
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-size: 0.9rem;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: rgba(255,255,255,0.16);
    color: white;
  }
`;

// ─── Link columns ─────────────────────────────────────────────────────────────

const NavCol = styled.div``;

const ColTitle = styled.h4`
  margin: 0 0 16px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: white;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NavItem = styled.li``;

const NavLink = styled(Link)`
  font-size: 0.88rem;
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  transition: color 0.12s;

  &:hover { color: white; }
`;

const ExternalLink = styled.a`
  font-size: 0.88rem;
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  transition: color 0.12s;

  &:hover { color: white; }
`;

// ─── Bottom bar ───────────────────────────────────────────────────────────────

const BottomBar = styled.div`
  border-top: 1px solid rgba(255,255,255,0.08);
  padding: 20px 32px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 560px) { padding: 20px; }
`;

const Copyright = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const LegalLink = styled.a`
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.12s;

  &:hover { color: rgba(255,255,255,0.75); }
`;

// ─── Component ────────────────────────────────────────────────────────────────

// ─── Component ────────────────────────────────────────────────────────────────
// Four-column footer: Brand+newsletter | Product | Company | Support
// Bottom bar shows copyright and legal links.

export default function FooterContainer() {
  // Newsletter subscription — swap setSubscribed for a real API call when ready
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: send email to a mailing list (e.g. Mailchimp, Supabase edge function)
    setSubscribed(true);
    setEmail("");
  };

  return (
    <FooterWrap aria-label="Site footer">
      <Main>

        {/* ── Brand + newsletter ── */}
        <BrandCol>
          <LogoRow to="/">
            <img src="/logo1.jpg" alt="Afarmer logo" loading="lazy" />
            <LogoText>AFARMER</LogoText>
          </LogoRow>
          <BrandDesc>
            The marketplace connecting local farmers and buyers across Kenya.
            Fresh produce, direct from the farm to your table.
          </BrandDesc>

          <NewsLabel>Stay in the loop</NewsLabel>
          {subscribed ? (
            <SubSuccess>✓ You're subscribed — thank you!</SubSuccess>
          ) : (
            <InputRow onSubmit={handleSubscribe}>
              <EmailInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
              <SubBtn type="submit">Subscribe</SubBtn>
            </InputRow>
          )}

          {/* Social icons — replace href values with real profile URLs */}
          <SocialRow>
            <SocialBtn href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">𝕏</SocialBtn>
            <SocialBtn href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">f</SocialBtn>
            <SocialBtn href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">◎</SocialBtn>
            <SocialBtn href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</SocialBtn>
          </SocialRow>
        </BrandCol>

        {/* ── Product links ── */}
        <NavCol>
          <ColTitle>Product</ColTitle>
          <NavList>
            <NavItem><NavLink to="/forfarms">For Farmers</NavLink></NavItem>
            <NavItem><NavLink to="/for farmersmarket">For Buyers</NavLink></NavItem>
            <NavItem><NavLink to="/pricing">Pricing</NavLink></NavItem>
            <NavItem><NavLink to="/wholesale">Wholesale</NavLink></NavItem>
            <NavItem><NavLink to="/shop">Merch Shop</NavLink></NavItem>
          </NavList>
        </NavCol>

        {/* ── Company links ── */}
        <NavCol>
          <ColTitle>Company</ColTitle>
          <NavList>
            <NavItem><NavLink to="/aboutus">Our Story</NavLink></NavItem>
            <NavItem><NavLink to="/news">News</NavLink></NavItem>
            <NavItem><NavLink to="/agritourism">Agritourism</NavLink></NavItem>
            <NavItem><NavLink to="/contactus">Contact Us</NavLink></NavItem>
            <NavItem><ExternalLink href="mailto:hello@afarmer.co.ke">hello@afarmer.co.ke</ExternalLink></NavItem>
          </NavList>
        </NavCol>

        {/* ── Support links ── */}
        <NavCol>
          <ColTitle>Support</ColTitle>
          <NavList>
            <NavItem><NavLink to="/faq">FAQ</NavLink></NavItem>
            <NavItem><NavLink to="/sellers-guide">Seller's Guide</NavLink></NavItem>
            <NavItem><NavLink to="/sign-up">Create Account</NavLink></NavItem>
            <NavItem><NavLink to="/mobile">Open App</NavLink></NavItem>
          </NavList>
        </NavCol>

      </Main>

      {/* ── Bottom legal bar ── */}
      <BottomBar>
        <Copyright>
          © {new Date().getFullYear()} Afarmer™. Built By Sana Fred.
        </Copyright>
        <LegalLinks>
          <LegalLink href="#">Terms of Service</LegalLink>
          <LegalLink href="#">Privacy Policy</LegalLink>
          <LegalLink href="#">Security</LegalLink>
        </LegalLinks>
      </BottomBar>
    </FooterWrap>
  );
}
