import styled from "styled-components";

const BodyComponent = ({ heading, subheading, description, bgcolor }) => {
  return (
    <MainContainer bgcolor={bgcolor}>
      <p>{subheading}</p>
      <h1>{heading}</h1>
      <p>{description}</p>
      <DownloadContainer>
        <a href="">
          <img src="/app store.png" alt="google play logo" />
        </a>
        <a href="">
          <img src="/google store.png" alt="app store logo" />
        </a>
      </DownloadContainer>
    </MainContainer>
  );
};
const MainContainer = styled.div`
  padding: 20px 40px;
  background-color: ${(props) =>
    props.bgcolor === "white" ? "#f0f4f6" : "#e5f4ff"};

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
  a {
    img {
      max-width: 110px;
      height: auto;
    }
  }
`;

export default BodyComponent;
