import { useSearchParams } from "react-router-dom";
import { getArticles, getCategories } from "../api/articles.js";
import ArticleGrid from "../components/articles/ArticleGrid.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useAsync } from "../hooks/useAsync.js";

export default function HomePage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";

  const categories = useAsync(getCategories, []);
  const articles = useAsync(() => getArticles({ category }), [category, user?.id]);

  const selectCategory = (value) => setSearchParams(value ? { category: value } : {});

  return (
    <>
      <PageHeader
        title="Today's headlines"
        subtitle="The latest stories from around the world, with AI summaries and private notes."
      />

      <div className="chips">
        <button className={`chip ${!category ? "is-active" : ""}`} onClick={() => selectCategory("")}>
          All
        </button>
        {categories.data?.categories.map((name) => (
          <button
            key={name}
            className={`chip ${category === name ? "is-active" : ""}`}
            onClick={() => selectCategory(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <ArticleGrid
        articles={articles.data?.articles}
        loading={articles.loading}
        error={articles.error}
        emptyMessage="News is being fetched. Try again in a moment."
      />
    </>
  );
}
