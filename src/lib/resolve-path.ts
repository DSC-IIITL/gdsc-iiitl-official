export function validatePath(str: string) {
  // Check if the str is a valid path or url
  try {
    new URL(str);
  } catch (err) {
    return true;
  }
  // Check if the origin is in white listed origins
  const whiteListedOrigins =
    process.env["WHITE_LISTED_DOMAINS"]?.split(",")?.map((str) => str.trim()) ||
    [];

  const url = new URL(str);
  const origin = url.origin;
  if (whiteListedOrigins.includes(origin)) {
    return true;
  }
  return false;
}
