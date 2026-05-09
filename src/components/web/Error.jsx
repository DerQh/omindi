import styled from "styled-components";
import Navbar from "./Navbar";

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  padding: 20px 40px;
  height: 100dvh;
`;

const ErrorTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const ErrorContent = styled.p`
  font-size: 1.2rem;
  text-align: center;
`;

function ErrorDisplay() {
  return (
    <>
      {/* <Navbar></Navbar> */}
      <ErrorContainer>
        <ErrorTitle>Ooops .. </ErrorTitle>
        <ErrorContent>
          The page you are looking for does not exist. Please check the URL and
          try again......
        </ErrorContent>
      </ErrorContainer>
    </>
  );
}

export default ErrorDisplay;
