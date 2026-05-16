import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled from "styled-components";
import { useCreateListing } from "../../hooks/useCreateListing";

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

  &:disabled {
    background: #9db79b;
    cursor: not-allowed;
  }
`;

const NewListing = () => {
  // mutate is the function to call to create a new listing, isPending indicates if the creation is in progress
  const { mutate, isPending } = useCreateListing();
  const navigate = useNavigate();

  const [name, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [minimumOrder, setMinimumOrder] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [unit, setUnit] = useState("");
  const [seller_name, setSellerName] = useState("");

  const handleBack = () => navigate(-1);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    mutate(
      {
        title: name,
        description,
        price,
        minimumOrder,
        location,
        category,
        image,
        unit,
        seller_name,
      },
      {
        // After successfully creating a listing, navigate back to the listing page
        onSuccess: () => {
          navigate("/list");
        },
      },
    );
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
              <label>Item Name</label>
              <input
                value={name}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Field>

            <Field>
              <label>Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Field>
            <Field>
              <label>/Unit</label>
              <input
                placeholder="Price per ?"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
              />
            </Field>

            <Field>
              <label>Minimum Order</label>
              <input
                value={minimumOrder}
                onChange={(e) => setMinimumOrder(e.target.value)}
                placeholder="e.g. 1 kg, 5 pieces"
              />
            </Field>

            <Field>
              <label>Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Field>

            <Field>
              <label>Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Field>

            <Field>
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>

            <ImageUpload>
              <label htmlFor="imageUpload">Upload Image</label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {preview && (
                <PreviewGrid>
                  <PreviewImage src={preview} alt="preview" />
                </PreviewGrid>
              )}
            </ImageUpload>

            <SubmitButton type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create New Listing"}
            </SubmitButton>
          </form>
        </FormCard>
      </Container>
    </>
  );
};

export default NewListing;
