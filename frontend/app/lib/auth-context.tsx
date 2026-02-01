"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  bookmarks: string[];
  toggleBookmark: (articleId: string) => void;
  likes: Record<string, boolean>;
  toggleLike: (articleId: string) => void;
  notes: Record<string, { text: string; isAI: boolean }[]>;
  addNote: (articleId: string, text: string, isAI?: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<
    Record<string, { text: string; isAI: boolean }[]>
  >({});

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("folio_user");
    const savedBookmarks = localStorage.getItem("folio_bookmarks");
    const savedLikes = localStorage.getItem("folio_likes");
    const savedNotes = localStorage.getItem("folio_notes");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    if (savedLikes) setLikes(JSON.parse(savedLikes));
    if (savedNotes) setNotes(JSON.parse(savedNotes));

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split("@")[0],
    };
    setUser(newUser);
    localStorage.setItem("folio_user", JSON.stringify(newUser));
  };

  const signup = async (email: string, password: string, name?: string) => {
    // Simulate API call
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: name || email.split("@")[0],
    };
    setUser(newUser);
    localStorage.setItem("folio_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("folio_user");
  };

  const toggleBookmark = (articleId: string) => {
    const newBookmarks = bookmarks.includes(articleId)
      ? bookmarks.filter((id) => id !== articleId)
      : [...bookmarks, articleId];
    setBookmarks(newBookmarks);
    localStorage.setItem("folio_bookmarks", JSON.stringify(newBookmarks));
  };

  const toggleLike = async (articleId: string) => {
    const isCurrentlyLiked = !!likes[articleId];
    const endpoint = isCurrentlyLiked ? "unlike" : "like";
    const newLikes = { ...likes, [articleId]: !isCurrentlyLiked };
    setLikes(newLikes);
    try {
      const response = await fetch(
        `http://localhost:4000/article/${articleId}/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update like on server");
      }
      const data = await response.json();
      console.log(
        `✅ Backend updated: ${articleId} now has ${data.likes} total likes.`,
      );
    } catch (error) {
      console.error("❌ Error updating like:", error);
      const rollbackLikes = { ...likes, [articleId]: isCurrentlyLiked };
      setLikes(rollbackLikes);
      // localStorage.setItem("folio_likes", JSON.stringify(rollbackLikes));
      alert("Could not sync like to server. Please check your connection.");
    }
  };

  const addNote = (articleId: string, text: string, isAI = false) => {
    const newNotes = {
      ...notes,
      [articleId]: [...(notes[articleId] || []), { text, isAI }],
    };
    setNotes(newNotes);
    localStorage.setItem("folio_notes", JSON.stringify(newNotes));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        bookmarks,
        toggleBookmark,
        likes,
        toggleLike,
        notes,
        addNote,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
