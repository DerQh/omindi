import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled from "styled-components";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #eef7ee;
  padding: 20px 24px 40px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const BackButton = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 1.2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;

  &:hover {
    background: #245026;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #2f5a2a;
  flex: 1;
  text-align: center;
`;

const FormCard = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(20, 57, 32, 0.08);
  padding: 32px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;

  label {
    display: block;
    margin-bottom: 8px;
    color: #2f5a2a;
    font-weight: 600;
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: #2f5a2a;
      box-shadow: 0 0 4px rgba(47, 90, 42, 0.2);
    }
  }

  textarea {
    resize: vertical;
    min-height: 120px;
  }
`;

const FileInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #2f5a2a;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #245026;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Update = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "update",
    image: null,
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("New post:", formData);
    // For now, just navigate back to community
    navigate("/community");
  };

  return (
    <>
      <AppNavbar />
      <PageWrapper>
        <Header>
          <BackButton onClick={handleBack}>←</BackButton>
          <Title>Share Update</Title>
        </Header>

        <FormCard>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <label htmlFor="type">Post Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="update">Update</option>
                <option value="news">News</option>
                <option value="event">Event</option>
                <option value="market">Market</option>
              </select>
            </FormGroup>

            <FormGroup>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter your post title"
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                placeholder="Share your update with the community"
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="image">Image (optional)</label>
              <FileInput
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </FormGroup>

            <SubmitButton type="submit">Share Update</SubmitButton>
          </form>
        </FormCard>
      </PageWrapper>
    </>
  );
};

export default Update;