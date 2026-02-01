"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/app/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TypingEffect } from "@/app/components/typing-effect";
import { useAuth } from "@/app/lib/auth-context";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
// import { articles } from "@/app/lib/articles";
import {
  Heart,
  Bookmark,
  MessageSquare,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { likes, toggleLike, bookmarks, toggleBookmark, notes, addNote } =
    useAuth();
  const { user } = useUser();
  const [article, setArticle] = useState<any>(null);
  // const article = articles.find((a) => a.id === params.id);
  const [noteText, setNoteText] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      const response = await fetch(
        `http://localhost:8000/scrape?url=https://www.bbc.com/news/articles/${params.id}`,
      );
      const data = await response.json();
      console.log("Fetched article:", data);
      setArticle(data);
    }
    fetchArticle();
  }, []);

  if (!article) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </main>
    );
  }
  // console.log("::::", article.images[0]);
  const isLiked = likes[article.id];
  const isBookmarked = bookmarks.includes(article.id);
  const articleNotes = notes[article.id] || [];

  const handleLike = () => {
    if (!user) {
      alert("Please log in to like articles");
      return;
    }
    toggleLike(article.id);
  };

  const handleBookmark = () => {
    if (!user) {
      alert("Please log in to bookmark articles");
      return;
    }
    toggleBookmark(article.id);
  };

  const handleAddNote = () => {
    if (!user) {
      alert("Please log in to add notes");
      return;
    }
    if (noteText.trim()) {
      addNote(article.id, noteText, false);
      setNoteText("");
    }
  };

  const generateAISummary = async () => {
    if (!user) {
      alert("Please log in to use AI features");
      return;
    }

    setIsGeneratingSummary(true);
    await fetch("http://localhost:4000/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: article.content,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(setAiSummary(data.summary)));
    console.log("AI Summary:", aiSummary);
    setIsGeneratingSummary(false);
  };

  const generateAINote = async () => {
    if (!user) {
      alert("Please log in to use AI features");
      return;
    }

    setIsGeneratingNote(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 600));

    const aiGeneratedNote = `${article.title} represents a pivotal moment in ${article.category}. The breakthrough demonstrates significant progress and opens new possibilities for future innovation.`;
    addNote(article.id, aiGeneratedNote, true);
    setIsGeneratingNote(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
                {article.title}
              </h1>
              <p className="text-xl text-muted-foreground text-balance">
                {article.description}
              </p>
            </div>
          </div>

          {/* Article Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground border-b border-border pb-6">
            <div>
              <p className="font-medium text-foreground">{article.author}</p>
              <p>{new Date(article.date).toLocaleDateString()}</p>
            </div>
            <div className="hidden sm:block w-px h-6 bg-border" />
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
              {article.category}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={article.images ? article.images[1].image_url : "/placeholder.svg"}
            alt={article.title}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Action Bar */}
        {user && (
          <div className="flex gap-3 mb-8 p-4 bg-muted rounded-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              className="gap-2 bg-transparent"
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
              />
              {isLiked ? "Liked" : "Like"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBookmark}
              className="gap-2 bg-transparent"
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? "fill-primary text-primary" : ""}`}
              />
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={generateAISummary}
              disabled={isGeneratingSummary || !!aiSummary}
              className="gap-2 ml-auto bg-transparent"
            >
              <Sparkles className="w-4 h-4" />
              {isGeneratingSummary ? "Generating..." : "AI Summary"}
            </Button>
          </div>
        )}

        {/* AI Summary Section */}
        {aiSummary && user && (
          <Card className="mb-12 p-6 border-primary/30 bg-primary/5">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Summary
            </h2>
            <div className="text-base leading-relaxed text-foreground">
              <TypingEffect text={aiSummary} speed={1} />
            </div>
          </Card>
        )}

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <p>{article.content}</p>
        </div>

        {/* Notes Section */}
        {user && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              My Notes
            </h2>

            {/* Add Note Form */}
            <Card className="p-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Add a personal note
                  </label>
                  <Textarea
                    placeholder="Write your thoughts about this article..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="min-h-24"
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleAddNote} disabled={!noteText.trim()}>
                    Add Note
                  </Button>
                  <Button
                    variant="outline"
                    onClick={generateAINote}
                    disabled={isGeneratingNote}
                    className="gap-2 bg-transparent"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isGeneratingNote ? "Generating..." : "Generate AI Note"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Notes List */}
            {articleNotes.length > 0 && (
              <div className="space-y-4">
                {articleNotes.map((note, index) => (
                  <Card key={index} className="p-4">
                    {note.isAI && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium text-primary">
                          AI-Generated
                        </span>
                      </div>
                    )}
                    <p className="text-foreground leading-relaxed">
                      {note.text}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Guest CTA */}
        {!user && (
          <Card className="p-8 text-center bg-muted/50">
            <h3 className="text-xl font-semibold mb-3">Unlock Full Features</h3>
            <p className="text-muted-foreground mb-6">
              Sign in to bookmark articles, add notes, and use AI-powered
              features.
            </p>
            <div className="flex gap-3 justify-center">
              <SignedOut>
                {/* Sign In: Minimalist Ghost Style */}
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-slate-700 hover:text-[#322b24] transition-colors cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>

                {/* Sign Up: Primary Action Style */}
                <SignUpButton mode="modal">
                  <button className="bg-[#37322a] hover:bg-[#322b24] text-white rounded-full font-medium text-sm h-10 px-5 transition-all active:scale-95 shadow-sm cursor-pointer">
                    Get Started
                  </button>
                </SignUpButton>
              </SignedOut>
            </div>
          </Card>
        )}
      </article>
    </main>
  );
}
