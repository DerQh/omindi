import styled from "styled-components";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";

const PricingContainer = styled.div`
  padding: 20px 40px;
  background-color: #37b3e3;
  color: #000000;

  div {
    margin-bottom: 30px;
  }
`;

const Heading = styled.h2`
  font-size: 50px;
  letter-spacing: 4px;
  font-weight: 800;
  line-height: 62px;
`;

const Subheading = styled.p`
  font-size: 27px;
  letter-spacing: 2px;
  font-weight: 600;
  line-height: 32px;
`;

const UpgradeContainer = styled.div`
  background-color: #fff;
  padding: 20px 30px;
  border-radius: 10px;
  margin-top: 20px;

  h2 {
    font-size: 24px;
    letter-spacing: 2px;
    font-weight: 700;
    line-height: 36px;
    margin-bottom: 15px;
    text-align: center;
  }
  p {
    font-size: 16px;
    letter-spacing: 1px;
    font-weight: 700;
    line-height: 27.2px;
    margin-bottom: 15px;
    span {
      font-weight: 500;
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #ccc;
  margin: 20px 0;
`;
const UpgradeButton = styled.button`
  background-color: rgb(97, 152, 49);
  color: #fff;
  padding: 15px 20px;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #37b3e3;
  }
`;
const SpanItem = styled.span`
  color: #fd7e14;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #37b3e3;
    text-decoration: underline;
  }
`;
const Pricing = () => {
  return (
    <>
      <Navbar />
      <PricingContainer>
        <div>
          <Heading>
            Enhance Your Farm's Visibility at No Cost-Start Selling Today!
          </Heading>
          <Subheading>
            Establish a brand, cultivate a following, and generate sales on
            Farmish.
          </Subheading>
          <UpgradeButton>Set Up Your Listing</UpgradeButton>
        </div>
        <div>
          <p>
            Afarmer s free to join, shop, create listings, and build a
            personalized profile. Have additional items to sell? Upgrade for
            unlimited listings with no expiration!
          </p>
          {/* // NEXT SECTION */}
          <UpgradeContainer>
            <h2>Free Plan</h2>
            <p>List up to 3 items simultaneously.</p>
            <ul>
              <li>
                Create up to 3 active listings for your farm at any given time.
              </li>
              <li>
                Listings remain active for as long as you need and can be
                changed whenever you wish.
              </li>
              <li>
                Engage with local buyers and start establishing your presence in
                the Farmish community—completely free of charge.
              </li>
            </ul>
            <p>
              Want to expand further?
              <span>
                Explore our Unlimited Listings plan for year-round visibility
                and additional features.
              </span>
            </p>
            {/* DIVIDER */}
            <Divider> </Divider>
            <h2>Limitless Listings</h2>
            <p>Elevate your farm for only Kes10 per month or Kes99 per year.</p>
            <ul>
              <li>
                Maintain unlimited listings year-round for constant visibility.
              </li>
              <li>
                Establish a permanent landing page to highlight your farm and
                products.
              </li>
              <li>
                Expand your business without the stress of managing listing
                limits.
              </li>
              <li>
                Grow your business without the hassle of managing listing
                restrictions.
              </li>
            </ul>
            <p>
              Want to expand further? Explore our Unlimited Listings plan for
              year-round visibility and additional features.
            </p>
            <div>
              <a href="/upgrade">
                <SpanItem>Upgrade Now </SpanItem> for Kes10/month or Kes99/year
              </a>
            </div>
            <UpgradeButton>Upgrade Now</UpgradeButton>
          </UpgradeContainer>
        </div>
      </PricingContainer>
      <FooterContainer />
    </>
  );
};

export default Pricing;
