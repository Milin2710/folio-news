"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Navbar } from "./components/navbar";
import { ArticleCard } from "./components/article-card";
import { useAuth } from "./lib/auth-context";
import { TailSpin } from "react-loader-spinner";

const categories = [
  "All",
  "Technology",
  "Science",
  "Environment",
  "Energy",
  "Education",
];
const locations = ["All", "USA", "Europe", "India"];

type Article = {
  description: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  title: string;
};

export default function Home() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAsiaArticles() {
      try {
        setLoading(true); // 1. Start Spinner
        const response = await fetch("http://localhost:4000/world");
        const data = await response.json();

        console.log("Fetched articles:", data);
        setArticles(data); // 2. Update Data
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setLoading(false); // 3. Stop Spinner ONLY when finished
      }
    }

    fetchAsiaArticles();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-balance leading-tight">
            Stay Informed with{" "}
            <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Folio News
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Get personalized news, AI-powered summaries, and intelligent
            insights all in one place.
            {user &&
              " Bookmark articles, create notes, and stay on top of what matters."}
          </p>
        </div>

        {loading ? (
          <div className="loader-container">
            <TailSpin
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="tail-spin-loading"
              radius="1"
              visible={true}
            />
            <p>Fetching latest articles...</p>
          </div>
        ) : articles.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            {articles.map((article, index) => (
              <div
                key={index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
              >
                <ArticleCard article={article} showActions={true} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in-up">
            <p className="text-lg text-muted-foreground">
              No articles found for the selected filters.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
