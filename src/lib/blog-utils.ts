/**
 * Blog utility functions
 * Shared utilities for blog post formatting and calculations
 */

const WORDS_PER_MINUTE = 200;

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export const estimateReadingTime = (content: string): string => {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / WORDS_PER_MINUTE);
  return `${minutes} min read`;
};
