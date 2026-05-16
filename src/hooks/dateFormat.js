// const formatDate = (dateString) => {
//   console.log("Formatting date:", dateString);
//   return new Date(dateString).toLocaleDateString(undefined, {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });
// };

// e.g. "2 days ago"
const formatSmartDate = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);

  const diffInMs = now - past;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Show relative time if within last 7 days
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 7) return `${diffInDays} days ago`;

  // Otherwise show formatted date
  return past.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

export { formatSmartDate };
