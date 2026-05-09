import styled from "styled-components";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";

/* Container */
const ContactUsContainer = styled.div`
  background-color: #f5f5f5;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  min-height: 70vh;
`;

/* Title / content */
const ContactUsTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 12px;
`;

const ContactUsContent = styled.p`
  font-size: 1.05rem;
  text-align: center;
  max-width: 700px;
  margin-bottom: 24px;
  color: #4a4a4a;
`;

/* Form layout */
const Form = styled.form`
  width: 100%;
  max-width: 720px;
  background: #ffffff;
  border-radius: 10px;
  padding: 40px 20px;
  box-shadow: 0 6px 18px rgba(20, 20, 20, 0.06);
`;

/* Row for first/last name */
const Row = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

/* Form field wrapper */
const Field = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

/* Label */
const Label = styled.label`
  font-size: 0.9rem;
  margin-bottom: 6px;
  color: #555;
`;

/* Shared input/textarea styles */
const sharedFieldStyles = `
  width: 90%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fafafa;
  font-size: 1rem;
  color: #222;
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &:focus {
    outline: none;
    border-color: #9796b6; /* Indigo-600 */
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
    background: #fff;
  }

  &::placeholder {
    color: #9aa0a6;
  }
`;

/* Input and textarea styled components */
const Input = styled.input`
  ${sharedFieldStyles}
  height: 44px;
`;

const Textarea = styled.textarea`
  ${sharedFieldStyles}
  min-height: 140px;
  resize: vertical;
`;

/* Submit button */
const SubmitButton = styled.button`
  margin-top: 14px;
  padding: 12px 18px;
  background: linear-gradient(90deg, #c0bfc9, #06b6d4);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 120ms ease,
    box-shadow 120ms ease,
    opacity 120ms ease;
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.16);

  &:hover {
    transform: translateY(-2px);
    opacity: 0.98;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 14px rgba(79, 70, 229, 0.12);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

/* Small helper for inline note or errors */
const Small = styled.small`
  color: #888;
  margin-top: 8px;
  display: block;
`;

function ContactUs() {
  return (
    <>
      <Navbar />
      <ContactUsContainer>
        <ContactUsTitle>Contact Us</ContactUsTitle>
        <ContactUsContent>
          Welcome to our contact section! Here you can find ways to get in touch
          with us for any inquiries or support.
        </ContactUsContent>

        <Form
          onSubmit={(e) => {
            e.preventDefault(); /* handle submit */
          }}
        >
          <Row>
            <Field>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                placeholder="First Name"
                type="text"
                id="firstName"
                name="firstName"
                required
                aria-required="true"
              />
            </Field>

            <Field>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                placeholder="Last Name"
                type="text"
                id="lastName"
                name="lastName"
              />
            </Field>
          </Row>

          <Field style={{ marginBottom: 16 }}>
            <Label htmlFor="email">Email</Label>
            <Input
              placeholder="you@example.com"
              type="email"
              id="email"
              name="email"
              required
              aria-required="true"
            />
          </Field>

          <Field>
            <Label htmlFor="message">How can we be of help?</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Describe your message..."
            />
          </Field>

          <SubmitButton type="submit">Submit</SubmitButton>

          <Small>We typically reply within 1–2 business days.</Small>
        </Form>
      </ContactUsContainer>
      <FooterContainer />
    </>
  );
}

export default ContactUs;
