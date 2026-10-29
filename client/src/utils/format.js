const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// "5 minutes ago", "3 hours ago", "2 days ago", then a normal date.
export function timeAgo(dateString) {
  if (!dateString) return "";
  const seconds = Math.round((Date.now() - new Date(dateString).getTime()) / 1000);

  if (seconds < MINUTE) return "just now";
  if (seconds < HOUR) return `${Math.floor(seconds / MINUTE)} min ago`;
  if (seconds < DAY) return `${Math.floor(seconds / HOUR)} h ago`;
  if (seconds < 7 * DAY) return `${Math.floor(seconds / DAY)} d ago`;
  return formatDate(dateString);
}

export function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
