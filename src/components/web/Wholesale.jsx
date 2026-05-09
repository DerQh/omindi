import styled from "styled-components";
import { useState } from "react";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";
import { Outlet } from "react-router-dom";

const FormContainer = styled.div`
  max-width: 600px;
  /* margin: 20px auto; */
  padding: 20px 40px;
  border-radius: 8px;
  background-color: #fff;
  p {
    font-size: 16px;
    line-height: 27.2px;
    font-weight: 500;
    margin-bottom: 45px;
    font-family: "Dosis", sans-serif;
    &:nth-child(3) {
      font-size: 20px;
      line-height: 32px;
      font-weight: 500;
      letter-spacing: 1px;
      margin-bottom: 45px;
    }
  }
  h2 {
    font-size: 32px;
    line-height: 43.2px;
    font-weight: 700;
    line-height: 54.2px;
    font-family: "Dosis", sans-serif;
    text-transform: uppercase;
    margin-bottom: 30px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 90%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 90%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #3c7a49;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  font-family: "Dosis", sans-serif;
  letter-spacing: 1px;

  &:hover {
    background-color: #218838;
  }
`;

const CaptchaContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const CaptchaInput = styled.input`
  width: 50px;
  margin-left: 10px;
`;

const MainContainer = styled.div`
  padding: 20px 40px;
  background-color: #f1f1f1;

  color: #000000;
  @media (max-width: 1200px) {
    padding: 60px;
  }

  @media (max-width: 768px) {
    padding: 50px;
  }

  @media (max-width: 480px) {
    padding: 30px;
  }

  p {
    font-size: 16px;
    letter-spacing: 3px;
    font-weight: 500;
    line-height: 27.2px;
    margin-bottom: 45px;
    font-family: "Montserrat", sans-serif;
    &:nth-child(3) {
      font-size: 20px;
      line-height: 32px;
      font-weight: 500;
      letter-spacing: 1px;
      margin-bottom: 45px;
    }
  }
  h1 {
    font-size: 42px;
    line-height: 43.2px;
    font-weight: 700;
    line-height: 54.2px;
    font-family: "Dosis", sans-serif;
    text-transform: uppercase;
  }
`;
const DownloadContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 5px;
  button {
    background-color: #3c7a49;
    color: #fff;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 18px;
    font-weight: 700;
    font-family: "Dosis", sans-serif;
    letter-spacing: 1px;

    &:hover {
      background-color: #218838;
    }
  }
  a {
    img {
      max-width: 110px;
      height: auto;
    }
  }
`;

const ImageDiv = styled.div`
  background-color: #fff;
  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const FaqContainer = styled.div`
  padding: 20px 40px;
  background-color: #f1f1f1;
  color: #000000;

  h2 {
    font-size: 27px;
    line-height: 36.8px;
    font-weight: 800;
    margin-bottom: 20px;
    font-family: "Dosis", sans-serif;
  }

  h3 {
    font-size: 16px;
    line-height: 28.8px;
    font-weight: 700;
    margin-bottom: 10px;
    font-family: "Dosis", sans-serif;
  }

  p {
    font-size: 16px;
    line-height: 27.2px;
    font-weight: 400;
    margin-bottom: 20px;
    font-family: "Dosis", sans-serif;
    padding-left: 20px;
  }
`;
const HowToUseContainer = styled.div`
  padding: 20px 40px;
  color: #000000;
  h2 {
    text-align: center;
    font-size: 32px;
    line-height: 43.2px;
    font-weight: 700;
    line-height: 54.2px;
    font-family: "Dosis", sans-serif;
    margin-bottom: 30px;
  }
`;

const FeedbackContainer = styled.div`
  padding: 50px 40px;
  background-color: #f1f1f1;
  color: #000000;
  font-size: 24px;
  line-height: 27.2px;
  letter-spacing: 1px;
  text-align: center;
  font-weight: 400;
  font-family: "Dosis", sans-serif;
`;

function Wholesale() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    companyName: "",
    companyWebsite: "",
    interestedItems: "",
    captchaAnswer: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add submission logic here
    console.log("Form submitted:", formData);
  };
  return (
    <>
      <Navbar></Navbar>
      <MainContainer>
        <p>GROW YOUR FARM BUSINESS</p>
        <h1>BECOME A LOCAL FOOD SUPPLIER</h1>
        <p>
          Create, manage, and grow direct wholesale relationships with local
          food buyers
        </p>
        <DownloadContainer>
          <button>Get Started</button>
        </DownloadContainer>
      </MainContainer>
      <ImageDiv>
        <img loading="lazy" src="/wholesale.png" alt="wholesale png" />
      </ImageDiv>
      <MainContainer>
        <p>GET STARTED TODAY</p>
        <h1>ONE PROFILE, TWO WAYS TO GROW</h1>
        <p>
          Grow your farm business on Afarmer. Download the free app and start
          connecting with customers.
        </p>
        <DownloadContainer>
          <a href="">
            <img loading="lazy" src="/app store.png" alt="google play logo" />
          </a>
          <a href="">
            <img loading="lazy" src="/google store.png" alt="app store logo" />
          </a>
        </DownloadContainer>
      </MainContainer>
      <HowToUseContainer>
        <h2>How to use Afarmer</h2>
        <ImageDiv>
          <img src="/howtouse1.png" alt="how to use  picture" />
        </ImageDiv>
        <ImageDiv>
          <img src="/howtouse2.png" alt="how to use picture" />
        </ImageDiv>
      </HowToUseContainer>
      <FaqContainer>
        <h2>FAQ</h2>
        <h3>How does the wholesale process work on Afarmer?</h3>
        <p>
          Afarmer facilitates connections between farms, and wholesale buyers
          such as retailers, restaurant, and food brands,. Sellers create a free
          profile and listings showing their products. Buyers can browse these
          listings, message sellers directly, and arrange wholesale purchase.
        </p>
        <h3>Are there any fees for farms to join Afarmer and list products?</h3>
        <p>
          Afarmer is free for farms to join. You can create a profile and list
          products without any upfront cost. Our platform is designed to make it
          easy for producers and buyers to connect and build relationships that
          support local food systems.
        </p>
        <h3>What types of products can be bought and sold on Afarmer?</h3>
        <p>
          Afmarmer supports wide range of locally sourced and pproduced good,
          including but not limites to fresh produce, meat, dairy, honey,bakes
          goods, and speciality food items. Our platform is flexible flexible to
          accommodate the diverse offerings of farms and producers. Whether
          you’re a small-scale farmer, artisanal producer, or commercial grower,
          Afarmer provides a space to showcase your products and connect with
          wholesale buyers who value locally sourced goods.
        </p>
      </FaqContainer>
      <FormContainer>
        <h2>JOIN THE WAIT LIST</h2>
        <p>
          Over the next few months, we’ll be rolling out webinars, resources,
          and new wholesale profiles. Join the waitlist to be among the first in
          front of local farms near you to buy fresh, locally grown food. Fill
          out the form below to be added to the list and we’ll contact you with
          the next steps
        </p>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>First Name</Label>
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Last Name</Label>
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Confirm Email</Label>
            <Input
              type="email"
              name="confirmEmail"
              value={formData.confirmEmail}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Company or Organization</Label>
            <Input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Company Website / URL</Label>
            <Input
              type="url"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>
              What items are you interested in purchasing from local farms?
            </Label>
            <TextArea
              name="interestedItems"
              rows="4"
              value={formData.interestedItems}
              onChange={handleChange}
            />
          </FormGroup>
          <CaptchaContainer>
            <Label>Custom Captcha: 9 * 5 = </Label>
            <CaptchaInput
              type="text"
              name="captchaAnswer"
              value={formData.captchaAnswer}
              onChange={handleChange}
            />
          </CaptchaContainer>
          <Button type="submit">Submit</Button>
        </form>
      </FormContainer>
      <FeedbackContainer>
        “ Afarmer has resulted in both professional and personal relationships
        with incredible customers and people in my local community. Not Only
        have I been able to network and make sales but I have never eaten better
        or cleaner in my life! I downloaded it when I was the only producer
        within 50 miles and now there are over 40 in my town alone! I can’t wait
        to see what else Afarmer has up their sleeve!” – Lazy C Cattle Co.
      </FeedbackContainer>
      <FooterContainer />
    </>
  );
}

export default Wholesale;
