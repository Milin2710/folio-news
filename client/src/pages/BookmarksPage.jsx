import { getBookmarks } from "../api/articles.js";
import ArticleGrid from "../components/articles/ArticleGrid.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import { useAsync } from "../hooks/useAsync.js";

export default function BookmarksPage() {
  const { data, loading, error } = useAsync(getBookmarks, []);

  return (
    <>
      <PageHeader title="Bookmarks" subtitle="Stories you saved to read later." />
      <ArticleGrid
        articles={data?.articles}
        loading={loading}
        error={error}
        emptyTitle="No bookmarks yet"
        emptyMessage="Tap the bookmark icon on any story to save it here."
      />
    </>
  );
}
