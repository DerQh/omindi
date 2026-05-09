import styled from "styled-components";
import FooterContainer from "./Footer";
import Navbar from "./Navbar";

function ComingSoon() {
  return (
    <>
      <Navbar></Navbar>
      <ComingSoonContainer>
        <ComingSoonTitle>Coming Soon .....</ComingSoonTitle>
        <ComingSoonContent>
          We're working hard to bring you this feature. Stay tuned!
        </ComingSoonContent>
      </ComingSoonContainer>
      <FooterContainer></FooterContainer>
    </>
  );
}

export default ComingSoon;

const ComingSoonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 40px;
`;

const ComingSoonTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const ComingSoonContent = styled.p`
  font-size: 1.2rem;
  text-align: center;
`;
