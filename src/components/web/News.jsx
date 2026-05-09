import styled from "styled-components";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";

const NewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 40px;
`;

const NewsTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const NewsContent = styled.p`
  font-size: 1.2rem;
  text-align: center;
`;

function News() {
  return (
    <>
      <Navbar></Navbar>
      <NewsContainer>
        <NewsTitle>News</NewsTitle>
        <NewsContent>
          Welcome to our news section! Here you can find the latest updates and
          information related to farming and agriculture. Stay tuned for more
          news and announcements.
        </NewsContent>
      </NewsContainer>
      <FooterContainer></FooterContainer>
    </>
  );
}

export default News;
