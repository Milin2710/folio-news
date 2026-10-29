import EmptyState from "../ui/EmptyState.jsx";
import Spinner from "../ui/Spinner.jsx";
import ArticleCard from "./ArticleCard.jsx";

// Shows the loading, error, empty or results state for a list of articles.
export default function ArticleGrid({ articles, loading, error, emptyTitle = "No articles found", emptyMessage }) {
  if (loading) return <Spinner label="Fetching articles..." />;
  if (error) return <EmptyState tone="error" title="Could not load articles" message={error} />;
  if (!articles?.length) return <EmptyState title={emptyTitle} message={emptyMessage} />;

  return (
    <div className="grid">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
