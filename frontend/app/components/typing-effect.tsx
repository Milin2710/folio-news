"use client";

import React, { useEffect, useState } from "react";

interface TypingEffectProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function TypingEffect({
  text,
  speed = 30,
  className = "",
  onComplete,
}: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <div className={className}>
      <div dangerouslySetInnerHTML={{ __html: displayedText }} />
      {!isComplete && (
        <span className="inline-block w-1 h-5 ml-1 bg-primary animate-pulse" />
      )}
    </div>
  );
}
