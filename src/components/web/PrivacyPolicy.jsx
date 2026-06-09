import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";
import { Helmet } from "react-helmet-async";

const LAST_UPDATED = "June 2026";

function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Privacy Policy — AFARMER™</title>
        <meta name="description" content="Read AFARMER's Privacy Policy. Learn how we collect, use, and protect your personal data on Kenya's farm marketplace." />
      </Helmet>
      <Navbar />
      <Page>
        <Container>
          <Header>
            <Breadcrumb>
              <BreadcrumbLink onClick={() => navigate("/")}>Home</BreadcrumbLink>
              <span> / </span>
              <span>Privacy Policy</span>
            </Breadcrumb>
            <Title>Privacy Policy</Title>
            <Meta>Last updated: {LAST_UPDATED}</Meta>
          </Header>

          <Body>
            <Intro>
              AFARMER™ ("we", "us", "our") is committed to protecting your
              privacy. This policy explains what personal data we collect, how we
              use it, and your rights under Kenya's Data Protection Act, 2019.
            </Intro>

            <Section>
              <SectionTitle>1. Data We Collect</SectionTitle>
              <P>We collect the following when you use AFARMER™:</P>
              <List>
                <li><strong>Account data:</strong> name, email address, phone number, profile photo, farm name, and location.</li>
                <li><strong>Listing data:</strong> product descriptions, prices, and images you upload.</li>
                <li><strong>Transaction data:</strong> orders placed, cart items, and payment references.</li>
                <li><strong>Communication data:</strong> messages sent between buyers and sellers on the platform.</li>
                <li><strong>Usage data:</strong> pages visited, listings viewed, searches made, and device/browser information.</li>
              </List>
            </Section>

            <Section>
              <SectionTitle>2. How We Use Your Data</SectionTitle>
              <P>We use your data to:</P>
              <List>
                <li>Create and manage your account.</li>
                <li>Display and process your listings and orders.</li>
                <li>Send order confirmations and important account notifications.</li>
                <li>Improve the platform through analytics (Google Analytics).</li>
                <li>Investigate disputes and enforce our Terms of Service.</li>
                <li>Comply with legal obligations under Kenyan law.</li>
              </List>
            </Section>

            <Section>
              <SectionTitle>3. Data Sharing</SectionTitle>
              <P>We do not sell your personal data. We share data only with:</P>
              <List>
                <li><strong>Supabase:</strong> our database and authentication provider (servers located in the EU).</li>
                <li><strong>Safaricom / M-Pesa:</strong> for M-Pesa payment processing — only transaction-relevant data (phone number and amount).</li>
                <li><strong>Stripe:</strong> for card payment processing — card details go directly to Stripe and never pass through our servers. See <a href="https://stripe.com/privacy" target="_blank" rel="noreferrer">Stripe's Privacy Policy</a>.</li>
                <li><strong>Google:</strong> for analytics (anonymised usage data).</li>
                <li><strong>Law enforcement</strong> when required by a valid legal order.</li>
              </List>
            </Section>

            <Section>
              <SectionTitle>4. Data Retention</SectionTitle>
              <P>
                We retain your account data for as long as your account is active.
                If you delete your account, we will delete your personal data
                within 30 days, except where retention is required by law (e.g.
                transaction records for tax purposes).
              </P>
            </Section>

            <Section>
              <SectionTitle>5. Cookies and Analytics</SectionTitle>
              <P>
                We use Google Analytics to understand how users interact with the
                platform. This uses cookies to collect anonymised usage data such
                as pages visited and session duration. No personally identifiable
                information is shared with Google Analytics.
              </P>
              <P>
                You can opt out of Google Analytics tracking using the{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">
                  Google Analytics Opt-out Browser Add-on
                </a>.
              </P>
            </Section>

            <Section>
              <SectionTitle>6. Security</SectionTitle>
              <P>
                We use industry-standard security measures including HTTPS
                encryption, Supabase Row Level Security (RLS), and hashed
                passwords. However, no system is 100% secure and we cannot
                guarantee absolute security.
              </P>
            </Section>

            <Section>
              <SectionTitle>7. Your Rights (Kenya Data Protection Act, 2019)</SectionTitle>
              <P>You have the right to:</P>
              <List>
                <li>Access the personal data we hold about you.</li>
                <li>Correct inaccurate data.</li>
                <li>Delete your data ("right to be forgotten").</li>
                <li>Object to processing of your data for direct marketing.</li>
                <li>Data portability — receive your data in a structured format.</li>
              </List>
              <P>
                To exercise any of these rights, email us at{" "}
                <a href="mailto:privacy@afarmer.co.ke">privacy@afarmer.co.ke</a>.
              </P>
            </Section>

            <Section>
              <SectionTitle>8. Children's Privacy</SectionTitle>
              <P>
                AFARMER™ is not directed at children under 18. We do not
                knowingly collect data from minors. If you believe a minor has
                created an account, contact us and we will delete it promptly.
              </P>
            </Section>

            <Section>
              <SectionTitle>9. Changes to This Policy</SectionTitle>
              <P>
                We may update this policy periodically. We will notify you of
                material changes via the app or email. Your continued use of
                AFARMER™ after changes are posted constitutes acceptance.
              </P>
            </Section>

            <Section>
              <SectionTitle>10. Contact</SectionTitle>
              <P>
                For privacy-related questions or requests, contact our Data
                Protection Officer at{" "}
                <a href="mailto:privacy@afarmer.co.ke">privacy@afarmer.co.ke</a>.
              </P>
            </Section>

            <PolicyLink onClick={() => navigate("/terms")}>
              Read our Terms of Service →
            </PolicyLink>
          </Body>
        </Container>
      </Page>
      <FooterContainer />
    </>
  );
}

export default PrivacyPolicy;

// ─── Styles ───────────────────────────────────────────────────────────────────

const Page = styled.div`
  background: #f5f8f5;
  min-height: 100vh;
  padding: 48px 24px 80px;
`;

const Container = styled.div`
  max-width: 760px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 40px;
`;

const Breadcrumb = styled.p`
  font-size: 0.82rem;
  color: #aabcaa;
  margin: 0 0 16px;
  span { color: #7b8f7f; }
`;

const BreadcrumbLink = styled.span`
  color: #2f5a2a;
  cursor: pointer;
  font-weight: 600;
  &:hover { text-decoration: underline; }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 900;
  color: #1a3318;
  margin: 0 0 8px;
`;

const Meta = styled.p`
  font-size: 0.85rem;
  color: #aabcaa;
  margin: 0;
`;

const Body = styled.div`
  background: white;
  border-radius: 20px;
  padding: 48px 52px;
  box-shadow: 0 4px 24px rgba(20, 57, 32, 0.06);

  @media (max-width: 600px) {
    padding: 32px 24px;
  }

  a {
    color: #2f5a2a;
    font-weight: 600;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

const Intro = styled.p`
  font-size: 1rem;
  color: #44554c;
  line-height: 1.7;
  margin: 0 0 36px;
  padding-bottom: 28px;
  border-bottom: 1px solid #f0f5f0;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 1.05rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 10px;
`;

const P = styled.p`
  font-size: 0.93rem;
  color: #44554c;
  line-height: 1.75;
  margin: 0 0 10px;
`;

const List = styled.ul`
  margin: 8px 0 10px 20px;
  padding: 0;
  li {
    font-size: 0.93rem;
    color: #44554c;
    line-height: 1.75;
    margin-bottom: 4px;
  }
`;

const PolicyLink = styled.button`
  margin-top: 16px;
  background: none;
  border: none;
  color: #2f5a2a;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  &:hover { text-decoration: underline; }
`;
