import { NextResponse } from "next/server";
import { resolvePath, validatePath } from "./lib/resolve-path";

export function middleware(request: Request) {
  const url = new URL(request.url);
  const redirect = url.searchParams.get("redirect");
  if (redirect && !validatePath(redirect)) {
    const url = new URL(request.url);
    url.searchParams.delete("redirect");
    // redirect to the same url without redirect query param
    return NextResponse.redirect(resolvePath(url.toString()), { status: 302 });
  }
  // Store current request url path and search query param in a custom header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", url.pathname + url.search);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
