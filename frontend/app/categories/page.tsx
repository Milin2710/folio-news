"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/app/components/navbar";
import { ArticleCard } from "@/app/components/article-card";
import { articles } from "@/app/lib/articles";
import { Button } from "@/components/ui/button";
import { Grid3x3 } from "lucide-react";

const categories = [
  "world",
  "asia",
  "health",
  "business",
  "science_and_environment",
  "sport",
  "entertainment",
];

type Article = {
  description: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  title: string;
};

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recentCategories, setRecentCategories] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("folio-recent-categories");
    if (saved) {
      const recent = JSON.parse(saved) as string[];
      setRecentCategories(recent);
      setSelectedCategory(recent[0] || "world");
    } else {
      setSelectedCategory("world");
    }
  }, []);

  const displayedCategories = useMemo(() => {
    const active = selectedCategory ? [selectedCategory] : [];
    const remaining = categories.filter((cat) => !active.includes(cat));

    const recent = recentCategories
      .filter((cat) => !active.includes(cat) && categories.includes(cat))
      .slice(0, categories.length - 1 - active.length);

    return [
      ...active,
      ...recent,
      ...remaining.filter((cat) => !recent.includes(cat)),
    ].slice(0, categories.length);
  }, [selectedCategory, recentCategories]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);

    let updated = [
      category,
      ...recentCategories.filter((cat) => cat !== category),
    ];
    updated = updated.slice(0, categories.length);
    setRecentCategories(updated);
    localStorage.setItem("folio-recent-categories", JSON.stringify(updated));
  };

  const filteredArticles = useMemo(async () => {
    if (!selectedCategory) return [];
    const response = await fetch(`http://localhost:4000/${selectedCategory}`);
    const data = await response.json();
    console.log("Fetched Asia articles:", data);
    setArticles(data);
    return data;
  }, [selectedCategory]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 animate-in fade-in duration-500">
          <div className="flex items-center gap-3 mb-8">
            <Grid3x3 className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Categories</h1>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose a category to filter articles
            </p>
            <div className="flex flex-wrap gap-3">
              {displayedCategories.map((cat, index) => (
                <Button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-lg scale-105"
                      : "bg-secondary/80 hover:bg-secondary text-secondary-foreground"
                  } ${index === 0 && selectedCategory === cat ? "animate-in bounce-in duration-500" : ""}`}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 animate-in fade-in duration-500 delay-100">
          <p className="text-muted-foreground">
            Showing {filteredArticles.length} article
            {filteredArticles.length !== 1 ? "s" : ""} in{" "}
            <span className="font-semibold text-foreground">
              {selectedCategory}
            </span>
          </p>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 delay-200">
            {articles.map((article, index) => (
              <ArticleCard key={index} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-in fade-in duration-500">
            <p className="text-lg text-muted-foreground">
              No articles found in this category.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
