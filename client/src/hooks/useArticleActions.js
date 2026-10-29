import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as api from "../api/articles.js";
import { useAuth } from "../context/AuthContext.jsx";

// Like / bookmark state for one article, shared by the card and the article page.
export function useArticleActions(article) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState({
    liked: article.liked,
    likesCount: article.likesCount,
    bookmarked: article.bookmarked,
  });

  // Keep in sync when fresh data arrives (e.g. right after logging in)
  useEffect(() => {
    setState({
      liked: article.liked,
      likesCount: article.likesCount,
      bookmarked: article.bookmarked,
    });
  }, [article.liked, article.likesCount, article.bookmarked]);

  // Run an action, or send visitors to the login page first.
  async function run(action) {
    if (!user) {
      navigate("/login", { state: { from: location.pathname + location.search } });
      return;
    }
    try {
      const result = await action(article.id);
      setState((previous) => ({ ...previous, ...result }));
    } catch (error) {
      console.error(error);
    }
  }

  return {
    ...state,
    toggleLike: () => run(api.toggleLike),
    toggleBookmark: () => run(api.toggleBookmark),
  };
}
