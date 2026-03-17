/**
 * Format a date string to a human-readable relative time (e.g., "2 hours ago").
 */
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}w ago`;
  if (diffDay < 365) return `${Math.floor(diffDay / 30)}mo ago`;
  return `${Math.floor(diffDay / 365)}y ago`;
}

/**
 * Format a date string as ISO date (YYYY-MM-DD).
 */
export function formatISODate(dateStr: string): string {
  return new Date(dateStr).toISOString().split("T")[0];
}

/**
 * Format a date string to locale display.
 */
export function formatDisplayDate(dateStr: string, locale = "en-US"): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Check if a date string represents a date in the past.
 */
export function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

/**
 * Check if a date is within the next N days.
 */
export function isDueSoon(dateStr: string | null, days = 3): boolean {
  if (!dateStr) return false;
  const dueDate = new Date(dateStr);
  const now = new Date();
  const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return dueDate > now && dueDate <= threshold;
}

/**
 * Get the current ISO timestamp string.
 */
export function nowISO(): string {
  return new Date().toISOString();
}
