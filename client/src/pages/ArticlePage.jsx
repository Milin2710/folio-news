import { ArrowLeft, Bookmark, ExternalLink, Heart } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getArticle } from "../api/articles.js";
import NotesSection from "../components/articles/NotesSection.jsx";
import SummaryBox from "../components/articles/SummaryBox.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useArticleActions } from "../hooks/useArticleActions.js";
import { useAsync } from "../hooks/useAsync.js";
import { formatDate } from "../utils/format.js";

export default function ArticlePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data, loading, error } = useAsync(() => getArticle(id), [id, user?.id]);

  if (loading) return <Spinner label="Loading article..." />;
  if (error) return <EmptyState tone="error" title="Article not available" message={error} />;

  return <ArticleView article={data.article} />;
}

function ArticleView({ article }) {
  const { liked, likesCount, bookmarked, toggleLike, toggleBookmark } = useArticleActions(article);

  // Full text is stored with blank lines between paragraphs
  const paragraphs = (article.content || article.description || "").split("\n\n");

  return (
    <div className="article">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Back to headlines
      </Link>

      <div className="card__meta">
        <span className="tag">{article.category}</span>
        <span>{formatDate(article.pubDate)}</span>
      </div>

      <h1 className="article__title">{article.title}</h1>

      <div className="article__toolbar">
        <button className={`action ${liked ? "is-active" : ""}`} onClick={toggleLike}>
          <Heart size={16} fill={liked ? "currentColor" : "none"} /> {likesCount}
        </button>
        <button className={`action ${bookmarked ? "is-active" : ""}`} onClick={toggleBookmark}>
          <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
          {bookmarked ? "Saved" : "Save"}
        </button>
        <a className="action" href={article.link} target="_blank" rel="noreferrer">
          <ExternalLink size={16} /> Original
        </a>
      </div>

      {article.thumbnail && <img className="article__image" src={article.thumbnail} alt="" />}

      <SummaryBox articleId={article.id} initialSummary={article.summary} />

      <div className="article__body">
        {paragraphs.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>

      <NotesSection articleId={article.id} />
    </div>
  );
}
