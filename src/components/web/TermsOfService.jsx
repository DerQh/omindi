import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";
import { Helmet } from "react-helmet-async";

const LAST_UPDATED = "June 2026";

function TermsOfService() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Terms of Service — AFARMER™</title>
        <meta name="description" content="Read AFARMER's Terms of Service. Understand the rules and guidelines for using Kenya's farm marketplace." />
      </Helmet>
      <Navbar />
      <Page>
        <Container>
          <Header>
            <Breadcrumb>
              <BreadcrumbLink onClick={() => navigate("/")}>Home</BreadcrumbLink>
              <span> / </span>
              <span>Terms of Service</span>
            </Breadcrumb>
            <Title>Terms of Service</Title>
            <Meta>Last updated: {LAST_UPDATED}</Meta>
          </Header>

          <Body>
            <Intro>
              Welcome to AFARMER™. By accessing or using our platform at{" "}
              <strong>afarmer.co.ke</strong> (or any subdomain), you agree to be
              bound by these Terms of Service. Please read them carefully. If you
              disagree with any part, you may not use the platform.
            </Intro>

            <Section>
              <SectionTitle>1. Who We Are</SectionTitle>
              <P>
                AFARMER™ is a Kenyan farm marketplace that connects local farmers
                and agribusiness sellers with buyers across Kenya. We provide a
                platform for listing, discovering, and purchasing farm produce and
                related products.
              </P>
            </Section>

            <Section>
              <SectionTitle>2. Eligibility</SectionTitle>
              <P>
                You must be at least 18 years old to create an account. By
                registering, you confirm that the information you provide is
                accurate and that you have the legal capacity to enter into this
                agreement.
              </P>
            </Section>

            <Section>
              <SectionTitle>3. Your Account</SectionTitle>
              <P>
                You are responsible for maintaining the confidentiality of your
                login credentials and for all activity under your account. Notify
                us immediately at{" "}
                <a href="mailto:support@afarmer.co.ke">support@afarmer.co.ke</a>{" "}
                if you suspect unauthorised access.
              </P>
              <P>
                We reserve the right to suspend or terminate accounts that violate
                these terms, post fraudulent listings, engage in abuse, or
                otherwise harm the community.
              </P>
            </Section>

            <Section>
              <SectionTitle>4. Listings and Seller Responsibilities</SectionTitle>
              <P>Sellers agree to:</P>
              <List>
                <li>Only list products they own or have the right to sell.</li>
                <li>Provide accurate descriptions, prices, and photographs.</li>
                <li>Fulfil orders they accept in a timely and honest manner.</li>
                <li>Not list illegal, counterfeit, or unsafe goods.</li>
                <li>Comply with all applicable Kenyan laws including the Consumer Protection Act.</li>
              </List>
              <P>
                All listings are subject to admin review. AFARMER™ reserves the
                right to remove any listing without notice.
              </P>
            </Section>

            <Section>
              <SectionTitle>5. Buyer Responsibilities</SectionTitle>
              <P>Buyers agree to:</P>
              <List>
                <li>Provide accurate delivery information when placing orders.</li>
                <li>Pay for orders they commit to purchasing.</li>
                <li>Use the messaging system respectfully and in good faith.</li>
                <li>Not misuse the dispute or refund system.</li>
              </List>
            </Section>

            <Section>
              <SectionTitle>6. Payments</SectionTitle>
              <P>
                Payments on AFARMER™ may be processed via M-Pesa or other methods
                we support. By making a payment, you authorise the transaction.
                AFARMER™ is not liable for any delays or failures in payment
                processing caused by third-party providers.
              </P>
            </Section>

            <Section>
              <SectionTitle>7. Disputes Between Buyers and Sellers</SectionTitle>
              <P>
                AFARMER™ provides a dispute resolution channel for orders marked
                as disputed. While we will make reasonable efforts to assist, we
                are a marketplace and are not a party to transactions between buyers
                and sellers. We do not guarantee refunds but will investigate
                reported issues fairly.
              </P>
            </Section>

            <Section>
              <SectionTitle>8. Intellectual Property</SectionTitle>
              <P>
                The AFARMER™ name, logo, and platform design are our intellectual
                property. By uploading content (photos, descriptions), you grant
                us a non-exclusive, royalty-free licence to display that content
                on the platform. You retain ownership of your content.
              </P>
            </Section>

            <Section>
              <SectionTitle>9. Prohibited Conduct</SectionTitle>
              <P>You may not:</P>
              <List>
                <li>Scrape, copy, or reproduce platform data without permission.</li>
                <li>Attempt to hack, overload, or disrupt the platform.</li>
                <li>Harass or abuse other users.</li>
                <li>Create fake accounts or post fake reviews.</li>
                <li>Use the platform for any unlawful purpose.</li>
              </List>
            </Section>

            <Section>
              <SectionTitle>10. Limitation of Liability</SectionTitle>
              <P>
                AFARMER™ is provided "as is". We do not guarantee uninterrupted
                availability or that listings are accurate. To the fullest extent
                permitted by Kenyan law, AFARMER™ shall not be liable for
                indirect, incidental, or consequential damages arising from your
                use of the platform.
              </P>
            </Section>

            <Section>
              <SectionTitle>11. Changes to These Terms</SectionTitle>
              <P>
                We may update these terms at any time. Continued use of the
                platform after changes are posted constitutes acceptance of the
                updated terms. We will notify users of significant changes via
                the app or email.
              </P>
            </Section>

            <Section>
              <SectionTitle>12. Governing Law</SectionTitle>
              <P>
                These terms are governed by the laws of Kenya. Any disputes shall
                be subject to the jurisdiction of Kenyan courts.
              </P>
            </Section>

            <Section>
              <SectionTitle>13. Contact</SectionTitle>
              <P>
                For questions about these terms, contact us at{" "}
                <a href="mailto:support@afarmer.co.ke">support@afarmer.co.ke</a>.
              </P>
            </Section>

            <PolicyLink onClick={() => navigate("/privacy-policy")}>
              Read our Privacy Policy →
            </PolicyLink>
          </Body>
        </Container>
      </Page>
      <FooterContainer />
    </>
  );
}

export default TermsOfService;

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
