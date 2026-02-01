'use client'

import React, { useMemo } from 'react'
import { Navbar } from '@/app/components/navbar'
import { ArticleCard } from '@/app/components/article-card'
import { articles } from '@/app/lib/articles'
import { Flame } from 'lucide-react'

export default function TrendingPage() {
  const sortedByLikes = useMemo(() => {
    return [...articles].sort((a, b) => b.likes - a.likes)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <Flame className="w-8 h-8 text-orange-500 animate-pulse-soft" />
            <h1 className="text-4xl font-bold">Trending Now</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            The most liked articles across Folio News
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedByLikes.map((article, index) => (
            <div
              key={article.id}
              className="relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {index < 3 && (
                <div className="absolute -top-4 -right-4 z-10 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg animate-bounce">
                  {index + 1}
                </div>
              )}
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
