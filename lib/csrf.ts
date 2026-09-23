import "server-only";

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected = new URL(request.url).origin;
  if (origin) return origin === expected;

  const referer = request.headers.get("referer");
  if (!referer) return false;

  try {
    return new URL(referer).origin === expected;
  } catch {
    return false;
  }
}

export function requireSameOrigin(request: Request) {
  if (!isSameOrigin(request)) {
    throw new Error("CSRF_ORIGIN");
  }
}
