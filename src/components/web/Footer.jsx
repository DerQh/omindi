import styled from "styled-components";

const Footer = styled.footer`
  background-color: rgb(97, 152, 49);
  color: #ffffff;
  font-family: "Dosis", sans-serif;
  padding: 50px 40px 10px 40px;
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Brand = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
`;

const Logo = styled.a`
  display: inline-flex;
  gap: 12px;
  align-items: center;
  color: inherit;
  text-decoration: none;

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
`;

const Title = styled.span`
  font-weight: 700;
  font-size: 18px;
`;

const Desc = styled.p`
  margin: 0;
  font-size: 14px;
`;

const News = styled.div`
  margin-left: 0;
`;

const Heading = styled.h4`
  margin: 0 0 8px 0;
  font-size: 15px;
`;

const Note = styled.p`
  margin: 0 0 12px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InputWrap = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: #fff;
  color: #e6eef8;
  outline: none;
  font-size: 14px;
  transition:
    box-shadow 0.12s ease,
    border-color 0.12s ease;

  &::placeholder {
    color: rgba(71, 74, 79, 0.5);
  }

  &:focus {
    border-color: rgba(70, 70, 70, 0.95);
  }
`;

const Button = styled.button`
  background-color: #5c9132;
  color: #fff;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;

  &:active {
    transform: translateY(1px);
  }
  &:focus {
    outline: 3px solid rgba(0, 0, 0, 0.18);
    outline-offset: 2px;
  }
`;

const Social = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 10px;
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
`;

const Links = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
`;

const Col = styled.div`
  min-width: 0;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  margin: 8px 0;
  text-decoration: none;
  a {
    text-decoration: none;
    color: #fff;
    transition: color 0.12s ease;

    &:hover {
      color: #f9f9f9;
    }
  }
`;

const LegalCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
`;

const LegalNote = styled.p`
  margin: 0;
  color: #fff;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const LegalLink = styled.a`
  color: #fff;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #fff;
    text-decoration: underline;
  }
`;

export default function FooterContainer() {
  return (
    <Footer aria-label="Site footer">
      <Inner>
        <Top>
          <Brand>
            <Logo href="/" aria-label="Homepage">
              <img src="/logo1.jpg" alt="" />
            </Logo>
            <Desc>
              Discover fresh produce, support local farmers, and enjoy.
            </Desc>
          </Brand>

          <News>
            <Note>Subscribe for product updates and tips.</Note>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Subscribed!");
              }}
              aria-label="Subscribe to newsletter"
            >
              <label htmlFor="rvf-email" style={{ display: "none" }}>
                Email address
              </label>
              <InputWrap>
                <Input
                  id="rvf-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  placeholder="you@company.com"
                  required
                />
                <Button type="submit">Subscribe</Button>
              </InputWrap>
            </Form>

            <Social aria-hidden="false">
              <SocialLink
                href="https://twitter.com"
                aria-label="Twitter"
              ></SocialLink>
              <SocialLink
                href="https://github.com"
                aria-label="GitHub"
              ></SocialLink>
              <SocialLink
                href="https://www.linkedin.com"
                aria-label="LinkedIn"
              ></SocialLink>
            </Social>
          </News>
        </Top>

        <Links aria-label="Footer navigation">
          <Col>
            <Heading>Product</Heading>
            <List>
              <ListItem>
                <a href="#features">Features</a>
              </ListItem>
              <ListItem>
                <a href="#pricing">Pricing</a>
              </ListItem>
              <ListItem>
                <a href="#docs">Docs</a>
              </ListItem>
              <ListItem>
                <a href="#changelog">Changelog</a>
              </ListItem>
            </List>
          </Col>

          <Col>
            <Heading>Company</Heading>
            <List>
              <ListItem>
                <a href="#about">About</a>
              </ListItem>
              <ListItem>
                <a href="#careers">Careers</a>
              </ListItem>
              <ListItem>
                <a href="#press">Press</a>
              </ListItem>
              <ListItem>
                <a href="#contact">Contact</a>
              </ListItem>
            </List>
          </Col>

          <Col>
            <Heading>Resources</Heading>
            <List>
              <ListItem>
                <a href="#blog">Blog</a>
              </ListItem>
              <ListItem>
                <a href="#guides">Guides</a>
              </ListItem>
              <ListItem>
                <a href="#events">Events</a>
              </ListItem>
              <ListItem>
                <a href="#support">Support</a>
              </ListItem>
            </List>
          </Col>

          <LegalCol>
            <LegalNote>
              © {new Date().getFullYear()} Afarmer — Built By Fred.
            </LegalNote>
            <LegalLinks>
              <LegalLink href="#terms">Terms |</LegalLink>
              <LegalLink href="#privacy">Privacy </LegalLink>
              <LegalLink href="#security">Security</LegalLink>
            </LegalLinks>
          </LegalCol>
        </Links>
      </Inner>
    </Footer>
  );
}
