//is any library available for sanitization
function sanitizeInput(text) {
  if (typeof text !== "string") return text;
  return text.replace(/<\/?[^>]+(>|$)/g, "").trim();
}
module.exports = {
  sanitizeInput,
};
