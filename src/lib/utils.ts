import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatCountRepost(count?: number): string {
  if (!count || count === 0) return "0";

  const format = (num: number, suffix: string) => {
    const formatted = (count / num).toFixed(1);
    return formatted.endsWith(".0")
      ? `${parseInt(formatted)}${suffix}`
      : `${formatted}${suffix}`;
  };

  if (count < 1000) return count.toString();
  if (count < 1_000_000) return format(1000, "K");
  if (count < 1_000_000_000) return format(1_000_000, "M");

  return format(1_000_000_000, "B");
}

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

export const formatPlugCount = (count: number): string => {
  // 0 - 9,999 → comma format
  if (count < 10_000) {
    return new Intl.NumberFormat("en-US").format(count);
  }

  // 10K - 999,999 → K format (including 100K, 500K, etc.)
  if (count < 1_000_000) {
    const value = count / 1000;

    const rounded = Math.round(value * 10) / 10;

    return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}K`;
  }

  // 1M - 999M
  if (count < 1_000_000_000) {
    const value = count / 1_000_000;
    const rounded = Math.round(value * 10) / 10;

    return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}M`;
  }

  // 1B+
  const value = count / 1_000_000_000;
  const rounded = Math.round(value * 10) / 10;

  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}B`;
};

export const multiFormatDateString = (
  timestamp: string = ""
): string => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();

  // Invalid date
  if (isNaN(date.getTime())) return "";

  const diffMs = now.getTime() - date.getTime();

  // Prevent future timestamps from showing weird values
  if (diffMs < 0) return "Just now";

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  // Instagram-style short timestamps
  if (diffSeconds < 60) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }

  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  if (diffDays < 7) {
    return `${diffDays}d`;
  }

  if (diffDays < 30) {
    return `${diffWeeks}w`;
  }

  // 30 days or older
  const sameYear =
    date.getFullYear() === now.getFullYear();

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
};

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};


export const formatCount = (count: number): string => {
  if (count < 1000) return count.toString();

  if (count < 1_000_000) {
    const value = count / 1000;
    return `${parseFloat(value.toFixed(1))}K`;
  }

  if (count < 1_000_000_000) {
    const value = count / 1_000_000;
    return `${parseFloat(value.toFixed(1))}M`;
  }

  const value = count / 1_000_000_000;
  return `${parseFloat(value.toFixed(1))}B`;
};

export function safeTrendingScore(score: number): number {
  if (!Number.isFinite(score)) return 0;

  const rounded = Math.round(score);

  const MAX = 9223372036854775807;
  const MIN = -9223372036854775808;

  return Math.min(Math.max(rounded, MIN), MAX);
}