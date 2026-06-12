//is any library available for sanitization
export default function sanitizeInput(text) {
  if (typeof text !== "string") return text;
  return text.replace(/<\/?[^>]+(>|$)/g, "").trim();
}

