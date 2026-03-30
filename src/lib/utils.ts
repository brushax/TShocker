import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import React from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseColoredText = (text: string) => {
  const colorRegex = /\[c\/([a-fA-F0-9]{6}):([^\]]+)\]/g;
  const parts: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = colorRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const color = `#${match[1]}`;
    const coloredText = match[2];

    parts.push(
      React.createElement(
        'span',
        {
          key: match.index,
          style: { color, textShadow: `0 0 2px ${color}` },
        },
        coloredText
      )
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts.length > 0 ? parts : text;
};
