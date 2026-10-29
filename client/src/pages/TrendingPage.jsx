import { getArticles } from "../api/articles.js";
import ArticleGrid from "../components/articles/ArticleGrid.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useAsync } from "../hooks/useAsync.js";

export default function TrendingPage() {
  const { user } = useAuth();
  const { data, loading, error } = useAsync(() => getArticles({ sort: "trending" }), [user?.id]);

  return (
    <>
      <PageHeader title="Trending" subtitle="The most liked stories on Folio News." />
      <ArticleGrid
        articles={data?.articles}
        loading={loading}
        error={error}
        emptyMessage="Nothing is trending yet."
      />
    </>
  );
}
