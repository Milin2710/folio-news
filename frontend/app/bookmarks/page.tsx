"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/components/navbar";
import { ArticleCard } from "@/app/components/article-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/app/lib/auth-context";
import { useUser } from "@clerk/nextjs";
import { articles } from "@/app/lib/articles";
import { Bookmark } from "lucide-react";

export default function BookmarksPage() {
  const router = useRouter();
  const { bookmarks } = useAuth();
  const { user } = useUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center animate-fade-in-up">
          <h1 className="text-2xl font-bold mb-4">
            Sign in to view your bookmarks
          </h1>
          <Button onClick={() => router.push("/login")} className="mt-4">
            Sign In
          </Button>
        </div>
      </main>
    );
  }

  const bookmarkedArticles = articles.filter((article) =>
    bookmarks.includes(article.id),
  );

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <Bookmark className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">My Bookmarks</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {bookmarkedArticles.length === 0
              ? "You haven't bookmarked any articles yet."
              : `You have ${bookmarkedArticles.length} bookmarked article${bookmarkedArticles.length !== 1 ? "s" : ""}.`}
          </p>
        </div>

        {bookmarkedArticles.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            {bookmarkedArticles.map((article, index) => (
              <div
                key={article.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          <Card
            className="p-12 text-center animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse-soft" />
            <p className="text-lg text-muted-foreground mb-6">
              Start bookmarking articles to save them for later.
            </p>
            <Button onClick={() => router.push("/")} className="mt-4">
              Browse Articles
            </Button>
          </Card>
        )}
      </div>
    </main>
  );
}
