import { useSearchParams } from "react-router-dom";
import { getArticles } from "../api/articles.js";
import ArticleGrid from "../components/articles/ArticleGrid.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useAsync } from "../hooks/useAsync.js";

export default function SearchPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";

  const { data, loading, error } = useAsync(
    () => (query ? getArticles({ q: query }) : Promise.resolve({ articles: [] })),
    [query, user?.id],
  );

  return (
    <>
      <PageHeader
        title={query ? `Results for "${query}"` : "Search"}
        subtitle={query ? undefined : "Type something in the search box above."}
      />
      {query && (
        <ArticleGrid
          articles={data?.articles}
          loading={loading}
          error={error}
          emptyTitle="No matches"
          emptyMessage="Try different keywords."
        />
      )}
    </>
  );
}
