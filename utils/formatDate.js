export function formatDate(date) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.valueOf())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(parsed);
}
