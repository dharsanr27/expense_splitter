//is any library available for sanitization
export default function sanitizeInput(text:string) {
  if (typeof text !== "string") return text;
  return text.replace(/<\/?[^>]+(>|$)/g, "").trim();
}

