'use client'

import React, { Suspense, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/app/components/navbar'
import { ArticleCard } from '@/app/components/article-card'
import { articles } from '@/app/lib/articles'
import { Search } from 'lucide-react'
import Loading from './loading'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const searchResults = useMemo(() => {
    if (!query.trim()) return []

    const lowerQuery = query.toLowerCase()
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.description.toLowerCase().includes(lowerQuery) ||
        article.content.toLowerCase().includes(lowerQuery) ||
        article.author.toLowerCase().includes(lowerQuery)
    )
  }, [query])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Search Results</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          {query ? (
            <>
              Results for <span className="font-semibold text-foreground text-lg">"{query}"</span>
            </>
          ) : (
            'Enter a search query to get started'
          )}
        </p>
      </div>

      {query && (
        <div className="mb-6 animate-fade-in-up">
          <p className="text-muted-foreground">
            Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {searchResults.map((article, index) => (
            <div key={article.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.03}s` }}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-12 animate-fade-in-up">
          <p className="text-lg text-muted-foreground">
            No articles found matching your search.
          </p>
        </div>
      ) : null}
    </div>
  )
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={<Loading />}>
        <SearchPageContent />
      </Suspense>
    </main>
  )
}
