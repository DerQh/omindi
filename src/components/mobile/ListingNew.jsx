import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px 30px;
  min-height: 100vh;
  background: #f7fbff;
`;

const BackButton = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 1.2rem;
  cursor: pointer;
  margin-right: 16px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #245026;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const FormCard = styled.div`
  max-width: 700px;
  margin: 0 auto;
  background: white;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(20, 57, 32, 0.08);
  padding: 32px;
`;

const Title = styled.h1`
  margin: 0;
  color: #2f5a2a;
  flex: 1;
  text-align: center;
`;

const Field = styled.div`
  margin-bottom: 18px;

  label {
    display: block;
    margin-bottom: 8px;
    color: #44554c;
    font-weight: 600;
  }

  input,
  textarea {
    width: 100%;
    border: 1px solid #dbe5d8;
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 1rem;
    color: #273a25;
    background: #f8fcf8;
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

const ImageUpload = styled.div`
  margin-bottom: 20px;

  input {
    display: none;
  }

  label {
    display: inline-block;
    background: #2f5a2a;
    color: white;
    padding: 10px 16px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
  }
`;

const PreviewGrid = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 12px;
`;

const PreviewImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #dbe5d8;
`;

const SubmitButton = styled.button`
  width: 100%;
  margin-top: 12px;
  border: none;
  padding: 14px;
  background: #2f5a2a;
  color: white;
  border-radius: 14px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #245026;
  }
`;

const NewListing = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    location: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    const imagePreviews = files.map((file) => URL.createObjectURL(file));

    setImages(imagePreviews);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Form Data:", formData);
    console.log("Images:", images);

    navigate("/list");
  };

  return (
    <>
      <AppNavbar />
      <Container>
        <Header>
          <BackButton onClick={handleBack}>←</BackButton>
          <Title>Create a New Listing</Title>
        </Header>

        <FormCard>
          <form onSubmit={handleSubmit}>
            <Field>
              <label htmlFor="name">Item Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Organic Tomatoes"
              />
            </Field>

            <Field>
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. $12 / kg"
              />
            </Field>

            <Field>
              <label htmlFor="category">Category</label>
              <input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Produce"
              />
            </Field>

            <Field>
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Nairobi"
              />
            </Field>

            <Field>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the item and any pickup/delivery details."
              />
            </Field>

            {/* ✅ Image Upload Section */}
            <ImageUpload>
              <label htmlFor="imageUpload">Upload Images</label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />

              <PreviewGrid>
                {images.map((img, index) => (
                  <PreviewImage key={index} src={img} alt="preview" />
                ))}
              </PreviewGrid>
            </ImageUpload>

            <SubmitButton type="submit">Create New Listing</SubmitButton>
          </form>
        </FormCard>
      </Container>
    </>
  );
};

export default NewListing;
