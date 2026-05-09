import AppNavbar from "./AppNavbar";
import styled from "styled-components";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #eef7ee;
  padding: 20px 24px 40px;
`;

const PageTitle = styled.h1`
  margin: 0 0 14px;
  color: #264a28;
  font-size: 2.4rem;
  text-align: center;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  margin-top: 24px;
  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 14px 36px rgba(34, 79, 38, 0.08);
  overflow: hidden;
`;

const ProfileHeader = styled.div`
  padding: 28px 24px 18px;
  display: grid;
  gap: 16px;
  text-align: center;

  h2 {
    margin: 0;
    font-size: 2rem;
    color: #243a20;
  }

  p {
    margin: 0;
    color: #586956;
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 12px;
  padding: 0 24px 24px;

  div {
    flex: 1;
    background: #f4faf4;
    border-radius: 18px;
    padding: 18px 16px;
    text-align: center;
  }

  h3 {
    margin: 0 0 8px;
    color: #2f5a2a;
    font-size: 1.2rem;
  }

  p {
    margin: 0;
    color: #5b6d57;
    font-size: 0.95rem;
  }
`;

const MapCard = styled(ProfileCard)`
  display: flex;
  flex-direction: column;
  min-height: 360px;
`;

const MapHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #eef2ec;

  h3 {
    margin: 0;
    font-size: 1.3rem;
    color: #243a20;
  }

  p {
    margin: 8px 0 0;
    color: #5b6d57;
    font-size: 0.95rem;
  }
`;

const MapFrame = styled.div`
  flex: 1;
  overflow: hidden;

  iframe {
    width: 100%;
    height: 100%;
    min-height: 280px;
    border: none;
  }
`;

const ListingSection = styled(ProfileCard)`
  padding: 24px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 18px;
  color: #2f5a2a;
  font-size: 1.4rem;
`;

const ListingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
`;

const ListingCard = styled.div`
  background: #f8faf6;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(34, 79, 38, 0.06);
`;

const ListingImage = styled.div`
  height: 160px;
  background: #dfeee3;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ListingBody = styled.div`
  padding: 16px;

  h4 {
    margin: 0 0 10px;
    color: #233a23;
    font-size: 1.05rem;
  }

  p {
    margin: 0 0 10px;
    color: #52614e;
    font-size: 0.95rem;
    line-height: 1.45;
  }

  strong {
    color: #2f5a2a;
  }
`;

const profileInfo = {
  name: "Okello Farm",
  location: "Nyamware, Kisumu, Kenya",
  followers: 182,
  listingsCount: 8,
  bio: "Local farm owner specializing in fresh produce, honey, and dairy. Committed to sustainable sourcing and fair pricing for buyers and markets.",
  mapUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3990.2205496690306!2d36.78964937498744!3d-1.2832537999446297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1732c9ba8cac%3A0x912a6aae081f4fd1!2sKilimani%2C%20Nairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus",
  listings: [
    {
      id: 1,
      title: "Organic Cherry Tomatoes",
      price: "$12 / kg",
      image: "/tomatoes.jpg",
    },
    {
      id: 2,
      title: "Free-Range Eggs",
      price: "$6 / dozen",
      image: "/eggs.jpg",
    },
    {
      id: 3,
      title: "Raw Wildflower Honey",
      price: "$18",
      image: "/honeyfarm.jpg",
    },
    {
      id: 4,
      title: "Fresh Kale Bundle",
      price: "$9 / bundle",
      image: "/kales.jpg",
    },
  ],
};

const Profile = () => {
  return (
    <>
      <AppNavbar />
      <PageWrapper>
        <PageTitle>Account Profile</PageTitle>
        <ProfileGrid>
          <ProfileCard>
            <ProfileHeader>
              <h2>{profileInfo.name}</h2>
              <p>{profileInfo.bio}</p>
            </ProfileHeader>
            <StatsRow>
              <div>
                <h3>{profileInfo.followers}</h3>
                <p>Followers</p>
              </div>
              <div>
                <h3>{profileInfo.listingsCount}</h3>
                <p>Listings</p>
              </div>
              <div>
                <h3>{profileInfo.location.split(",")[0]}</h3>
                <p>Location</p>
              </div>
            </StatsRow>
            <MapHeader>
              <h3>Current Location</h3>
              <p>{profileInfo.location}</p>
            </MapHeader>
            <MapFrame>
              <iframe
                title="Profile location map"
                src={profileInfo.mapUrl}
                loading="lazy"
              />
            </MapFrame>
          </ProfileCard>

          <ListingSection>
            <SectionTitle>My Listings</SectionTitle>
            <ListingGrid>
              {profileInfo.listings.map((item) => (
                <ListingCard key={item.id}>
                  <ListingImage>
                    <img src={item.image} alt={item.title} />
                  </ListingImage>
                  <ListingBody>
                    <h4>{item.title}</h4>
                    <p>
                      <strong>{item.price}</strong>
                    </p>
                  </ListingBody>
                </ListingCard>
              ))}
            </ListingGrid>
          </ListingSection>
        </ProfileGrid>
      </PageWrapper>
    </>
  );
};

export default Profile;
