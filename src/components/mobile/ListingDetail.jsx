import { useContext, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled from "styled-components";
import { useUser } from "../../hooks/useUser";
import { useDeleteListing } from "../../hooks/useDeleteListing";
import LoadingComponent from "./Loading";
import ConfirmModule from "./ConfirmModule";
import {
  useAddItem,
  useCartItemCheck,
  useUpdateCartItem,
} from "../../hooks/useCart";
import { useQueryClient } from "@tanstack/react-query";
import { useStartConversation } from "../../hooks/useMessages";

const Container = styled.div`
  min-height: 100vh;
  background: #f7fbff;
  padding: 20px 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  max-width: 900px;
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
  height: 30px;
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
  /* color: #2f5a2a; */
  flex: 1;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f3a1d;
  letter-spacing: -0.2px;
  white-space: nowrap;
`;

const DetailCard = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(20, 57, 32, 0.08);
  overflow: hidden;
`;

const ImageSection = styled.div`
  width: 100%;
  height: 400px;
  background: #d7e9ff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ContentSection = styled.div`
  padding: 32px;
`;

const ProductName = styled.h2`
  margin: 0 0 16px;
  color: #2f5a2a;
  font-size: 1.6rem;
`;

const Price = styled.p`
  font-size: 1.6rem;
  color: #2f5a2a;
  font-weight: 700;
  margin: 0 0 24px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  padding: 24px;
  background: #f0f7ee;
  border-radius: 12px;
`;

const InfoItem = styled.div`
  p {
    margin: 0 0 8px;
    color: #7b8f7f;
    font-size: 0.95rem;
  }

  span {
    display: block;
    color: #2f5a2a;
    font-weight: 600;
    font-size: 1.1rem;
  }
`;

const DescriptionSection = styled.div`
  margin-bottom: 32px;

  h3 {
    color: #2f5a2a;
    margin: 0 0 12px;
    font-size: 1.3rem;
  }

  p {
    color: #44554c;
    line-height: 1.7;
    margin: 0;
  }
`;

const SellerSection = styled.div`
  background: #f0f7ee;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 32px;

  h3 {
    color: #2f5a2a;
    margin: 0 0 16px;
    font-size: 1.2rem;
  }
`;

const SellerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;

  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
  }

  div {
    p {
      margin: 0;
      color: #2f5a2a;
      font-weight: 600;
    }

    span {
      font-size: 0.95rem;
      color: #7b8f7f;
    }
  }
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const CartButton = styled.button`
  background-color: #ffc107;
  color: #2f5a2a;
  border: none;
  padding: 16px 24px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e0a800;
  }
`;

const BuyButton = styled.button`
  background-color: #2f5a2a;
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #245026;
    box-shadow: 0 4px 12px rgba(47, 90, 42, 0.3);
  }
`;

const InquireButton = styled.button`
  background-color: #e5f4ff;
  color: #2f5a2a;
  border: 2px solid #2f5a2a;
  padding: 16px 24px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d7e9ff;
  }
`;

// COMPONENT STARTS HERE
const ListingDetail = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // GET USER INFO
  const { data: user, isLoading } = useUser();
  // GET LISTING INFO FROM NAVIGATION STATE
  const location = useLocation();
  const listing = location.state?.listing;
  // DELETE AN ITEM
  const { mutate: deleteListing, isLoading: isDeleting } = useDeleteListing();
  const { mutate: mutateAddItem, isPending } = useAddItem();
  const { mutate: startConversation } = useStartConversation();

  const { data: isItemInCart, isLoading: isLoadingItemCheck } =
    useCartItemCheck({
      user_id: user?.id,
      listing_id: listing?.id,
    });

  const [showConfirm, setShowConfirm] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleGreenBtn = () => {
    let user_id = user?.id;
    let listing_id = listing?.id;
    if (user?.id === listing.seller_id) {
      // navigate("/edit-listing", { state: { listing } });
      alert("Edit functionality coming soon!");
    } else {
      if (isItemInCart) {
        alert("Item is already in the cart");
        navigate("/cart");
      } else {
        mutateAddItem(
          { user_id, listing_id },
          {
            onSuccess: () => {
              navigate("/cart", { state: { listing } });
            },
          },
        );
      }
    }
  };

  // --- ADD ITEMS TO CART / DELETE ITEM
  const handleOrangeBtn = () => {
    let user_id = user?.id;
    let listing_id = listing?.id;
    if (user?.id === listing.seller_id) {
      // CONFIRM BEFORE DELETING
      setShowConfirm(true); // Replaces window.confirm
    } else {
      if (isItemInCart) {
        alert("Item is already in the cart");
      } else {
        mutateAddItem({
          user_id,
          listing_id,
        });
      }
    }
  };

  const handleConfirmDelete = () => {
    deleteListing({ id: listing?.id });
    setShowConfirm(false);
  };

  const handleInquire = () => {
    startConversation(
      {
        buyer_id: user?.id,
        seller_id: listing?.seller_id,
        listing_id: listing?.id,
      },
      {
        onSuccess: (conversation) => {
          console.log("conversation:", conversation); // check this
          navigate("/messages", { state: { conversationId: conversation.id } });
        },
        onError: (e) => console.log("error:", e),
      },
    );
  };

  const handleEdit = () => {
    // navigate("/edit-listing", { state: { listing } });
  };

  if (isLoading) {
    return (
      <>
        <LoadingComponent />
      </>
    );
  }
  if (!listing) {
    return (
      <Container>
        <AppNavbar />
        <Header>
          <BackButton onClick={handleBack}>←</BackButton>
          <Title>Listing Not Found</Title>
        </Header>
      </Container>
    );
  }

  return (
    <>
      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <ConfirmModule
          text="Do you want to delete this listing"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <AppNavbar />
      <Container>
        <Header>
          <BackButton onClick={handleBack}>←</BackButton>
          <Title>Product Details</Title>
        </Header>

        <DetailCard>
          <ImageSection>
            <img src={listing.image_url} alt={listing.image_url} />
          </ImageSection>

          <ContentSection>
            <ProductName>{listing.title}</ProductName>
            <Price>
              Kes {listing.price}
              {listing.unit ? ` / ${listing.unit}` : ""}
            </Price>

            <InfoGrid>
              <InfoItem>
                <p>Category</p>
                <span>{listing.category}</span>
              </InfoItem>
              <InfoItem>
                <p>Location</p>
                <span>{listing.location}</span>
              </InfoItem>
              <InfoItem>
                <p>Availability</p>
                <span>Yes</span>
              </InfoItem>
              <InfoItem>
                <p>Minimum Order</p>
                <span>{listing.minimumOrder}</span>
              </InfoItem>
            </InfoGrid>

            <DescriptionSection>
              <h3>Description</h3>
              <p>{listing.description}</p>
            </DescriptionSection>

            <SellerSection>
              <h3>Seller Information</h3>
              <SellerInfo onClick={() => navigate(`/follower/${listing.id}`)}>
                <img
                  // src="https://picsum.photos/200/200"
                  src={
                    listing.seller_image_url || "https://picsum.photos/200/200"
                  }
                  alt={listing.image_url}
                />
                <div>
                  <p>{listing.seller_name}</p>
                  <span>
                    {/* ⭐ {listing.rating} ({listing.reviews}
                    reviews) */}
                    ⭐ 4.8 (24 reviews)
                  </span>
                </div>
              </SellerInfo>
            </SellerSection>

            <ActionButtons>
              <BuyButton onClick={handleGreenBtn}>
                {user?.id === listing.seller_id ? "Edit" : "Buy Now"}
              </BuyButton>

              <CartButton onClick={handleOrangeBtn} disabled={isDeleting}>
                {user?.id === listing.seller_id ? "Delete" : "Add to Cart"}
              </CartButton>
              {/* IF SELLER , DO NOT SHOW INQUIRY BUTTON */}
              {user?.id === listing.seller_id ? (
                ""
              ) : (
                <InquireButton onClick={handleInquire}>
                  Send Inquiry
                </InquireButton>
              )}
            </ActionButtons>
          </ContentSection>
        </DetailCard>
      </Container>
    </>
  );
};

export default ListingDetail;

// // Sample listings data
// const goods = [
//   {
//     id: 1,
//     name: "Organic Cherry Tomatoes",
//     price: "Kes 12 / kg",
//     description:
//       "Fresh locally grown cherry tomatoes, sweet and ready for market. These tomatoes are grown without any chemical pesticides and are perfect for salads, cooking, or canning. Harvested fresh daily and available year-round.",
//     category: "Produce",
//     location: "Alendu",
//     inquiries: 3,
//     favourites: 9,
//     updated: "05/02/2026",
//     image: "/tomatoes.jpg",
//     seller: {
//       name: "Kevin  Otieno",
//       rating: 4.8,
//       reviews: 24,
//       image: "https://picsum.photos/200",
//     },
//     fullDescription:
//       "We specialize in organic farming practices. Our cherry tomatoes are grown in rich, nutrient-dense soil without synthetic fertilizers. Each batch is carefully monitored and harvested at peak ripeness to ensure maximum flavor and nutrition.",
//     availability: "Year-round",
//     minOrder: "1 kg",
//   },
//   {
//     id: 2,
//     name: "Raw Honey Jar",
//     price: "Kes 18",
//     description:
//       "Cold-pressed wildflower honey in a 500g glass jar. Pure, unfiltered, and unpasteurized to retain all natural enzymes and nutrients.",
//     category: "Honey",
//     location: "Nyamasaria",
//     inquiries: 6,
//     favourites: 12,
//     updated: "04/30/2026",
//     image: "/honey.jpg",
//     seller: {
//       name: "Sarah Kipchoge",
//       rating: 4.9,
//       reviews: 42,
//       image: "https://picsum.photos/200",
//     },
//     fullDescription:
//       "Our honey comes from beehives located in pristine wildflower fields. We practice sustainable beekeeping and never use antibiotics or chemicals. The honey is raw, unheated, and retains all its beneficial properties.",
//     availability: "Available",
//     minOrder: "1 jar",
//   },
//   {
//     id: 3,
//     name: "Free-Range Eggs",
//     price: "Kes 5 / dozen",
//     description:
//       "Fresh free-range eggs from local farms, rich in flavor and nutrients.",
//     category: "Dairy",
//     location: "NanyNyamware",
//     inquiries: 9,
//     favourites: 18,
//     updated: "05/01/2026",
//     image: "/eggs.jpg",
//     seller: {
//       name: "Steven Odhiambo",
//       rating: 4.7,
//       reviews: 56,
//       image: "https://picsum.photos/200",
//     },
//     fullDescription:
//       "Our hens are raised on open pasture with access to natural grasses and insects. No cage confinement or artificial supplements. The eggs have deep orange yolks and superior taste due to the hens' natural diet.",
//     availability: "Daily",
//     minOrder: "1 dozen",
//   },
// ];
