import { useState } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";

const FAQContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 40px;
  background-color: #e5f4ff;
`;

const FAQTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const FaqContainer = styled.div`
  padding: 20px 40px;
  background-color: #f1f1f1;
  color: #000000;

  h2 {
    font-size: 27px;
    line-height: 36.8px;
    font-weight: 800;
    margin-bottom: 20px;
    font-family: "Dosis", sans-serif;
  }

  h3 {
    font-size: 16px;
    line-height: 28.8px;
    font-weight: 700;
    margin-bottom: 10px;
    font-family: "Dosis", sans-serif;
  }

  p {
    font-size: 16px;
    line-height: 27.2px;
    font-weight: 400;
    margin-bottom: 20px;
    font-family: "Dosis", sans-serif;
    padding-left: 20px;
  }
`;
function FAQ() {
  const faqs = [
    {
      question:
        "Am I legally allowed to sell _______ (raw milk, unwashed eggs, etc)?",
      answer: `It is the responsibility of the seller to know and follow the applicable laws regarding 
            the production, sale, and distribution of goods. Resources to find local laws include:
            - USDA
            - Local agricultural extension office
            - Your state Department of Agriculture.`,
    },
    {
      question: "What items are prohibited on Afarmer",
      answer: `Prohibited items include, but are not limited to: 
            - Any product that violates local, state, or federal law regarding its production, sale, or transport.
            - Marijuana or its derivatives in any form.
            - Food items not grown or produced on location (purchased from a store, imported, etc.).
            - Vehicles or items that require a title or license to operate.
            - Products that are misrepresented regarding their production or origin.
            - Products not applicable to the applicable categories and subcategories.`,
    },
    {
      question: "How do I buy items listed on Afarmer",
      answer: `Users can message the seller from the listing screen to arrange a meetup or pickup/drop-off point. 
            Meetups carry many of the same risks as Craigslist or other marketplace connections. 
            We suggest using safety precautions and being aware of potential scams.`,
    },
    {
      question: "What types of events can I list on Afarmer",
      answer: `You can create event listings for anything that connects people with local agriculture, such as:
            - Farmers markets
            - U-pick days
            - Farm tours
            - Seasonal festivals
            - Workshops (e.g., gardening or cooking)
            - Agritourism experiences (e.g., pumpkin patches or hayrides).`,
    },
    {
      question:
        "Is there a specific category for Agritourism events on Afarmer",
      answer: `Farmish doesn’t have a separate agritourism category, but you can create events and promote them 
            with clear descriptions and engaging photos.`,
    },
    {
      question: "Can I charge admission for my event?",
      answer: `Yes, you can charge admission or offer ticketed experiences, but Farmish doesn’t handle transactions; 
            all payments need to be managed offline or through your preferred system.`,
    },
    {
      question: "How do event listings work on Afarmer",
      answer: `Event listings allow you to share details of your upcoming events with the local community. 
            They appear on the map and in searches, helping people discover what’s happening nearby. 
            Listings are free and easy to create!`,
    },
    {
      question: "What kinds of details should I include in my event listing?",
      answer: `Include the date, time, location, and a brief description of what attendees can expect. 
            Adding photos and highlighting unique features can make your event more appealing.`,
    },
    {
      question: "Can I promote recurring events, like a weekly farmers market?",
      answer: `Yes! You can create separate listings for each date or include all dates in a single listing description.`,
    },
    {
      question: "What happens if I need to cancel my event?",
      answer: `You can update or remove your event listing at any time. Clear communication helps attendees 
            stay informed about cancellations or reschedules.`,
    },
    {
      question:
        "Can I use event listings to attract customers to my farm store?",
      answer: `Yes, many users list farm store openings, special sales, or seasonal offerings as events.`,
    },
    {
      question: "What food items can I sell on Afarmer",
      answer: `You can sell fresh, raw, uncut, and unprocessed food products grown or produced by you, 
            including meat, dairy, honey, maple syrup, and eggs, following local and federal regulations.`,
    },
    {
      question: "What non-food items can I sell on Afarmer",
      answer: `You can sell items related to farm/garden supplies, plants/trees as allowed by state law, 
            poultry, small farm animals, and non-vehicle farm/garden equipment.`,
    },
    {
      question: "How do I pay for the items listed?",
      answer: `Payments can be arranged with the seller via cash app, cash, debit/credit card, EBT (where applicable), 
            or through bartering. Transactions are made off the app.`,
    },
    {
      question: "Is there a fee to buy or sell?",
      answer: `No, there are no buyer fees, and sellers always have the option to sell for free in the app.`,
    },
    {
      question: "How does the wholesale process work on Afarmer",
      answer: `Farmish facilitates connections between farms, producers, and wholesale buyers like retailers 
            and restaurants. Sellers create free profiles and listings, while buyers can browse and arrange 
            wholesale purchases.`,
    },
    {
      question:
        "Are there any fees for farms to join Farmish and list products?",
      answer: `Farmish is free for farms to join. You can create a profile and list products without 
            any upfront costs.`,
    },
    {
      question:
        "What types of products can be bought and sold wholesale on Afarmer",
      answer: `Farmish supports a wide range of locally sourced and produced goods, including but 
            not limited to fresh produce, meat, dairy, honey, baked goods, and specialty food items. 
            Our platform is flexible to accommodate the diverse offerings of farms and producers.`,
    },
  ];


  return (
    <>
      <Navbar></Navbar>
      <FAQContainer>
        <FAQTitle>Frequently Asked Questions</FAQTitle>
        <FaqContainer>
          {faqs.map((faq, index) => (
            <h3 key={index}>
              <h3 onClick={() => toggleAnswer(index)}>{faq.question}</h3>
              <p>{faq.answer}</p>
            </h3>
          ))}
        </FaqContainer>
      </FAQContainer>
      <FooterContainer></FooterContainer>
    </>
  );
}

export default FAQ;
