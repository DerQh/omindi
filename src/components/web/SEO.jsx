import { Helmet } from "react-helmet-async";

const BASE_URL = "https://omindifarm.vercel.app";
const DEFAULT_IMAGE = `${BASE_URL}/afarmer.jpg`;
const SITE_NAME = "AFARMER™";

export default function SEO({ title, description, path = "", image }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Fresh Produce, Direct from the Farm`;
  const url = `${BASE_URL}${path}`;
  const og_image = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={og_image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={og_image} />
    </Helmet>
  );
}
