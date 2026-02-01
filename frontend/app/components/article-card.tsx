"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark } from "lucide-react";
import { useAuth } from "@/app/lib/auth-context";
import { useUser } from "@clerk/nextjs";
import { Article } from "@/app/lib/articles";

interface ArticleCardProps {
  article: Article;
  showActions?: boolean;
}

export function ArticleCard({ article, showActions = true }: ArticleCardProps) {
  const { likes, toggleLike, bookmarks, toggleBookmark } = useAuth();
  const { user } = useUser();
  const cleanUrl = article.link ? article.link.split("?")[0] : "none";
  const articleId = cleanUrl.split("/").pop();
  const isLiked = likes[article.id];
  const isBookmarked = bookmarks.includes(article.id);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to like articles");
      return;
    }
    toggleLike(article.id);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to bookmark articles");
      return;
    }
    toggleBookmark(article.id);
  };

  return (
    <Link href={`/article/${articleId}`}>
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer h-full transform hover:scale-105 hover:-translate-y-1 border border-border/50">
        <div className="aspect-video overflow-hidden bg-muted relative">
          <img
            src={article.thumbnail || "/placeholder.svg"}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full animate-fade-in-up">
              {article.category}
            </span>
            {showActions && user && (
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 w-8 p-0 transition-all duration-300 ${isBookmarked ? "text-primary scale-110" : "text-muted-foreground hover:text-primary"}`}
                onClick={handleBookmark}
              >
                <Bookmark
                  className={`w-5 h-5 transition-all duration-300 ${isBookmarked ? "fill-current" : ""}`}
                />
              </Button>
            )}
          </div>
          <h3 className="font-semibold text-base mb-2 line-clamp-2 text-balance group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {article.description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-foreground">
                {article.author}
              </span>
              <span className="text-xs">
                {new Date(article.date).toLocaleDateString()}
              </span>
            </div>
            {showActions && (
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 gap-1 transition-all duration-300 ${isLiked ? "text-red-500 scale-110" : "text-muted-foreground hover:text-red-500"}`}
                onClick={handleLike}
              >
                <Heart
                  className={`w-4 h-4 transition-all duration-300 ${isLiked ? "fill-red-500" : ""}`}
                />
                <span className="text-xs">
                  {/* {article.likes + (isLiked ? 1 : 0)} */}
                </span>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
