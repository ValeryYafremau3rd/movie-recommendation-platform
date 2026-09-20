export function encodeCursor(data: any) {
  return btoa(JSON.stringify(data));
}

export function decodeCursor(cursor: any) {
  return JSON.parse(atob(cursor));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function truncate(value: string, maxLength: number) {
  if (!value) {
    return "";
  }

  const text = String(value).trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}...`;
}

export function normalizeLabel(value: string) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function cleanText(value: string) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

export function unique(values: any[]) {
  return [...new Set(values.filter(Boolean))];
}
