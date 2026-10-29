import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import Layout from "./components/layout/Layout.jsx";
import ArticlePage from "./pages/ArticlePage.jsx";
import BookmarksPage from "./pages/BookmarksPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import TrendingPage from "./pages/TrendingPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="trending" element={<TrendingPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="article/:id" element={<ArticlePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route
          path="bookmarks"
          element={
            <ProtectedRoute>
              <BookmarksPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
