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
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  if (!dateString) return "";
  if (isNaN(past.getTime())) return ""; // guard invalid date

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return past.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

export { formatSmartDate };
