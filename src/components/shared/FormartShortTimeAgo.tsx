export const formatShortTimeAgo = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);

  let diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  const units = [
    { label: "y", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "w", seconds: 604800 },
    { label: "d", seconds: 86400 },
    { label: "h", seconds: 3600 },
    { label: "m", seconds: 60 },
  ];

  const result: string[] = [];

  for (const unit of units) {
    const value = Math.floor(diff / unit.seconds);
    if (value > 0) {
      result.push(`${value}${unit.label}`);
      diff -= value * unit.seconds;
    }

    // ✅ limit to 3 parts (like your example)
    if (result.length === 3) break;
  }

  if (result.length === 0) return "Just now";

  return result.join(", ") + " Ago";
};