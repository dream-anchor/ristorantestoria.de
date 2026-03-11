import React from 'react';

/**
 * Renders simple **bold** Markdown in translation strings as <strong> elements.
 * Only supports **bold** syntax.
 */
export function renderMarkdown(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}
