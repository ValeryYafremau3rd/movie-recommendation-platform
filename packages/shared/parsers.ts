export function normalizeUrl(url: string) {
  return url
    .replace(/%28/gi, "(")
    .replace(/%29/gi, ")")
    .replace(/%5F/gi, "_")
    .replace(/\\/g, "")
    .split("#")[0]
    .split("?")[0]
    .toLowerCase();
}

export function decodeHtml(value: string) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&nbsp;/gi, " ");
}

export function cleanText(value: string) {
  if (!value) {
    return "";
  }

  return decodeHtml(value)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<sup[\s\S]*?<\/sup>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(value: string) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function cleanEntityName(value: string) {
  return String(value).replace(/\s+/g, " ").trim();
}

export function toText(value: any) {
  if (value == null) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

export function getCleanElementText(element: any) {
  if (!element) {
    return "";
  }

  const clone = element.cloneNode(true);

  for (const node of clone.querySelectorAll(
    "style, script, sup.reference, .reference, cite",
  )) {
    node.remove();
  }

  for (const br of clone.querySelectorAll("br")) {
    br.replaceWith(" ");
  }

  return String(clone.textContent || "")
    .replace(/\s+/g, " ")
    .trim();
}
