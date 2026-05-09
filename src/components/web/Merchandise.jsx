
import styled from "styled-components";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";
import { useState } from "react";
import { Link } from "react-router-dom";

const product = {
  name: "Afarmer Combo Hat",
  price: "Kes 599",
  description:
    "This premium Afarmer Combo Hat is crafted from soft cotton and designed for a comfortable fit with a bold, modern silhouette.",
  image: "/shop/hat.jpg",
  category: "Accessories",
  details: [
    "Weight: 0.5kg",
    "Dimensions: 20cm x 15cm x 10cm",
    "Material: 100% Cotton",
  ],
};

const colors = [
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "green", label: "Green" },
];

const sizes = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "xl", label: "XL" },
];

function Merchandise() {
  const [review, setReview] = useState({
    name: "",
    email: "",
    rating: 0,
    comment: "",
  });

  const [productOptions, setProductOptions] = useState({
    color: "",
    size: "",
    quantity: 1,
  });

  const [cartMessage, setCartMessage] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setProductOptions((prev) => ({
      ...prev,
      [name]:
        name === "quantity"
          ? Math.max(1, Number(value) || 1)
          : value,
    }));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();

    if (!productOptions.color || !productOptions.size) {
      setCartMessage("Please choose a color and size before adding to cart.");
      return;
    }

    setCartMessage(
      `Added ${productOptions.quantity} ${product.name} (${productOptions.color}, ${productOptions.size}) to cart.`
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!review.rating || !review.comment.trim()) {
      setReviewMessage("Please provide a rating and a review comment.");
      return;
    }

    setReviewMessage("Thank you! Your review has been submitted.");
    console.log("Review submitted:", review);
    setReview({ name: "", email: "", rating: 0, comment: "" });
  };

  return (
    <>
      <Navbar />
      <ShopContainer>
        <Breadcrumbs>
          <Link to="/shop">Shop</Link>
          <span>/ Accessories /</span>
          <strong>{product.name}</strong>
        </Breadcrumbs>

        <ProductLayout>
          <ImageCard>
            <img loading="lazy" src={product.image} alt={product.name} />
          </ImageCard>

          <ProductSummary>
            <ProductTitle>{product.name}</ProductTitle>
            <Price>{product.price}</Price>
            <ProductText>{product.description}</ProductText>

            <OptionRow>
              <label htmlFor="color">Color</label>
              <select
                id="color"
                name="color"
                value={productOptions.color}
                onChange={handleOptionChange}
              >
                <option value="">Choose Color</option>
                {colors.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </OptionRow>

            <OptionRow>
              <label htmlFor="size">Size</label>
              <select
                id="size"
                name="size"
                value={productOptions.size}
                onChange={handleOptionChange}
              >
                <option value="">Choose Size</option>
                {sizes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <SizeGuideLink href="#">Size Guide</SizeGuideLink>
            </OptionRow>

            <QuantityForm onSubmit={handleAddToCart}>
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                value={productOptions.quantity}
                onChange={handleOptionChange}
              />
              <AddButton type="submit">Add to Cart</AddButton>
            </QuantityForm>

            {cartMessage && <StatusMessage>{cartMessage}</StatusMessage>}

            <ProductMeta>
              <span>SKU: N/A</span>
              <span>Category: {product.category}</span>
            </ProductMeta>
          </ProductSummary>
        </ProductLayout>

        <ProductDetails>
          <Section>
            <SectionTitle>Description</SectionTitle>
            <SectionText>{product.description}</SectionText>
          </Section>

          <Section>
            <SectionTitle>Additional Information</SectionTitle>
            <InfoList>
              {product.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </InfoList>
          </Section>

          <Section>
            <SectionTitle>Customer Reviews</SectionTitle>
            <ReviewIntro>
              There are no reviews yet. Be the first to review “{product.name}
              ”. Your email address will not be published. Required fields are
              marked *.
            </ReviewIntro>

            <ReviewForm onSubmit={handleSubmit}>
              <label>Your rating *</label>
              <RatingGroup role="radiogroup" aria-label="Product rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <RatingLabel key={star}>
                    <input
                      type="radio"
                      name="rating"
                      value={star}
                      onChange={handleReviewChange}
                      checked={review.rating === star}
                    />
                    <Star>{star}</Star>
                  </RatingLabel>
                ))}
              </RatingGroup>

              <label htmlFor="comment">Your review *</label>
              <textarea
                id="comment"
                name="comment"
                rows="4"
                value={review.comment}
                onChange={handleReviewChange}
                required
              />

              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={review.name}
                onChange={handleReviewChange}
                required
              />

              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={review.email}
                onChange={handleReviewChange}
                required
              />

              <div className="save-info">
                <input type="checkbox" id="save-info" />
                <label htmlFor="save-info">
                  Save my name and email for next time.
                </label>
              </div>

              {reviewMessage && <StatusMessage>{reviewMessage}</StatusMessage>}

              <button type="submit">Submit Review</button>
            </ReviewForm>
          </Section>
        </ProductDetails>
      </ShopContainer>
      <FooterContainer />
    </>
  );
}

export default Merchandise;

const ShopContainer = styled.div`
  padding: 40px;
  max-width: 1180px;
  margin: 0 auto;
`;

const Breadcrumbs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.95rem;
  margin-bottom: 24px;

  a {
    color: #2f6f2a;
    text-decoration: none;
  }

  strong {
    font-weight: 700;
  }
`;

const ProductLayout = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  align-items: start;
  margin-bottom: 40px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ImageCard = styled.div`
  border-radius: 16px;
  overflow: hidden;
  background: #f7f7f7;
  padding: 16px;

  img {
    width: 100%;
    max-height: 520px;
    object-fit: cover;
    border-radius: 12px;
  }
`;

const ProductSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const ProductTitle = styled.h1`
  font-size: 2.5rem;
  margin: 0;
`;

const ProductText = styled.p`
  line-height: 1.75;
  color: #444;
`;

const Price = styled.p`
  font-size: 2rem;
  color: #ffb300;
  font-weight: 700;
  margin: 0;
`;

const OptionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;

  label {
    font-weight: 600;
    min-width: 70px;
  }

  select {
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    min-width: 220px;
    background: #fff;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SizeGuideLink = styled.a`
  color: #2f6f2a;
  text-decoration: none;
  font-size: 0.95rem;

  &:hover {
    text-decoration: underline;
  }
`;

const QuantityForm = styled.form`
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 12px;
  align-items: center;

  label {
    font-weight: 600;
  }

  input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const AddButton = styled.button`
  padding: 12px 20px;
  background-color: #5c9132;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  min-width: 140px;

  &:hover {
    background-color: #4a7228;
  }
`;

const ProductMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: #666;
  font-size: 0.95rem;
`;

const ProductDetails = styled.div`
  display: grid;
  gap: 32px;
  text-align: start;
`;

const Section = styled.section`
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  margin: 0 0 16px;
  font-size: 1.5rem;
`;

const SectionText = styled.p`
  line-height: 1.8;
  color: #444;
  margin: 0;
`;

const InfoList = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: #444;

  li {
    margin-bottom: 10px;
  }
`;

const ReviewIntro = styled.p`
  margin: 0 0 16px;
  line-height: 1.7;
  color: #555;
`;

const ReviewForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;

  label {
    font-weight: 600;
  }

  textarea,
  input[type="text"],
  input[type="email"],
  input[type="number"] {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
    resize: vertical;
  }

  .save-info {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  button {
    width: 180px;
    padding: 12px 18px;
    background-color: #5c9132;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      background-color: #4a7228;
    }
  }

  @media (max-width: 600px) {
    button {
      width: 100%;
    }
  }
`;

const RatingGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const RatingLabel = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  border: 1px solid #ccc;
  padding: 10px 14px;
  border-radius: 8px;
  transition: background 0.2s ease;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &:hover {
    background: #f3fff0;
  }
`;

const Star = styled.span`
  font-size: 1rem;
  color: #333;
`;

const StatusMessage = styled.div`
  padding: 14px 18px;
  border-radius: 12px;
  background: #eef9ed;
  color: #266226;
  font-size: 0.95rem;
`;
