import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_REALM, isAdminAuthorization } from "@/lib/admin-auth";

// Prompts for the admin password on the private talent pool. Pages and route
// handlers re-check authorization themselves; this only triggers the browser login.
export function proxy(request: NextRequest) {
  if (isAdminAuthorization(request.headers.get("authorization"))) {
    return NextResponse.next();
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": ADMIN_REALM },
  });
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/talent/:path*",
    "/api/talent/admin/:path*",
    "/api/talent/recommend/:path*",
  ],
};
