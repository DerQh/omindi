
import styled from "styled-components";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Afarmer Combo Mug",
    price: "Kes 200",
    image: "/shop/mugs.jpg",
    alt: "Mugs",
    link: "/shop/item",
  },
  {
    id: 2,
    name: "T-Shirt White and Black",
    price: "Kes 699",
    image: "/shop/t-shirt.png",
    alt: "T-Shirt",
    link: "/shop/item",
  },
  {
    id: 3,
    name: "Afarmer Black Mug",
    price: "Kes 1,250",
    image: "/shop/mug.jpg",
    alt: "Mug",
    link: "/shop/item",
  },
  {
    id: 4,
    name: "Afarmer White and Black Tote Bag",
    price: "Kes 3,899",
    image: "/shop/tote.jpg",
    alt: "Tote Bag",
    link: "/shop/item",
  },
  {
    id: 5,
    name: "Afarmer White and Black Hat",
    price: "Kes 599",
    image: "/shop/hat.jpg",
    alt: "Hat",
    link: "/shop/item",
  },
  {
    id: 6,
    name: "Afarmer White and Black Hoodies",
    price: "Kes 599",
    image: "/shop/hoodies.jpg",
    alt: "Hoodies",
    link: "/shop/item",
  },
];

function Shop() {
  return (
    <>
      <Navbar />
      <ShopContainer>
        <ShopTitle>Merchandise Shop</ShopTitle>
        <ShopContent>
          {products.map((product) => (
            <ProductCard key={product.id}>
              <Link to={product.link}>
                <img loading="lazy" src={product.image} alt={product.alt} />
                <h4>{product.name}</h4>
                <Price>{product.price}</Price>
              </Link>
            </ProductCard>
          ))}
        </ShopContent>
      </ShopContainer>
      <FooterContainer />
    </>
  );
}

export default Shop;

const ShopContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ShopTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 40px;
  text-align: center;
`;

const ShopContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
`;

const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #8f8f8f;
  padding: 20px;
  text-align: center;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: #fff;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    border-color: #000;
  }

  a {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  img {
    max-width: 100%;
    max-height: 250px;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
    margin-bottom: 15px;
  }

  h4 {
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0 0 10px 0;
    color: #333;
  }
`;

const Price = styled.p`
  font-size: 1.1rem;
  color: #ffb300;
  font-weight: 600;
  margin: 0;
`;
