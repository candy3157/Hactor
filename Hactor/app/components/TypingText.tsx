"use client";

import { useEffect, useState } from "react";

type Props = {
  text: string;
  speed?: number;
  pause?: number;
  className?: string;
};

export default function TypingText({
  text,
  speed = 70,
  pause = 1200,
  className = "",
}: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    let index = 0;
    let timeoutId = 0;

    const type = () => {
      index += 1;
      setValue(text.slice(0, index));

      if (index < text.length) {
        timeoutId = window.setTimeout(type, speed);
        return;
      }

      timeoutId = window.setTimeout(() => {
        index = 0;
        setValue("");
        timeoutId = window.setTimeout(type, speed);
      }, pause);
    };

    type();

    return () => window.clearTimeout(timeoutId);
  }, [text, speed, pause]);

  return (
    <span className={`relative inline-block whitespace-nowrap ${className}`}>
      <span className="opacity-0">{text}</span>
      <span className="absolute inset-0 inline-flex items-center">
        {value}
        <span className="ml-1 h-[1em] border-r border-current opacity-80 animate-pulse" />
      </span>
    </span>
  );
}
