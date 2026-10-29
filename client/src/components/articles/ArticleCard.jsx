import { Bookmark, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useArticleActions } from "../../hooks/useArticleActions.js";
import { timeAgo } from "../../utils/format.js";

export default function ArticleCard({ article }) {
  const { liked, likesCount, bookmarked, toggleLike, toggleBookmark } = useArticleActions(article);

  return (
    <article className="card">
      <Link to={`/article/${article.id}`} className="card__image">
        {article.thumbnail ? (
          <img src={article.thumbnail} alt="" loading="lazy" />
        ) : (
          <div className="card__image-placeholder">{article.category}</div>
        )}
      </Link>

      <div className="card__body">
        <div className="card__meta">
          <span className="tag">{article.category}</span>
          <span>{timeAgo(article.pubDate)}</span>
        </div>

        <h3 className="card__title">
          <Link to={`/article/${article.id}`}>{article.title}</Link>
        </h3>
        <p className="card__description">{article.description}</p>

        <div className="card__actions">
          <button
            className={`action ${liked ? "is-active" : ""}`}
            onClick={toggleLike}
            aria-pressed={liked}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} /> {likesCount}
          </button>
          <button
            className={`action ${bookmarked ? "is-active" : ""}`}
            onClick={toggleBookmark}
            aria-pressed={bookmarked}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </article>
  );
}
