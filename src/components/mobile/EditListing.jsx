import { useNavigate } from "react-router-dom";

export function EditListing() {
  const navigate = useNavigate();
  return (
    <>
      <h1>
        EDITING PAGE COMING SOON
        <span
          onClick={() => {
            navigate(-1);
          }}
        >
          go back{" "}
        </span>{" "}
      </h1>
    </>
  );
}
