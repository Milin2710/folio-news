import { Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState.jsx";

export default function NotFoundPage() {
  return (
    <>
      <EmptyState title="Page not found" message="The page you are looking for does not exist." />
      <p className="center-message">
        <Link to="/" className="button">Back to home</Link>
      </p>
    </>
  );
}
