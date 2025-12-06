import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession, verifyExternalUser, VerifyPanelRequest } from "@/lib/auth";

const publicRoutes = [
  "/api/hostels/register",
  "/api/auth",
  "/api/auth/login-owner",
  "/api/registrations/submit",
  "/api/verify-token", 
  "/api/students", 
  "/api/students/login", 
];

const allowedOrigins = [
  "https://hostelhub.pk",
  "https://www.hostelhub.pk",
  "https://hostel-hub-control-panel.vercel.app",
  "http://localhost:3001"
];

function withCorsHeaders(response: NextResponse, origin: string) {
  response.headers.set("Access-Control-Allow-Origin", allowedOrigins.includes(origin) ? origin : "");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-token");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

export async function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") || "";
  const pathname = request.nextUrl.pathname;

  // Handle OPTIONS preflight
  if (request.method === "OPTIONS") {
    return withCorsHeaders(new NextResponse(null, { status: 200 }), origin);
  }

  let response = NextResponse.next();
  response = withCorsHeaders(response, origin);

  const isPublicRoute = publicRoutes.some((route) => pathname == route);
  if (isPublicRoute) return response;

  // Admin session
  if (pathname.startsWith("/admin") && pathname !== "/admin-portal-login") {
    const session = await getSession();
    if (!session) {
      const redirectRes = NextResponse.redirect(new URL("/admin-portal-login", request.url));
      return withCorsHeaders(redirectRes, origin);
    }
  }

  // Students APIs
  if (pathname.startsWith('/api/students')) {
    const token = request.headers.get("authorization");

    if (!token) {
      return withCorsHeaders(
        NextResponse.json({ error: "Unauthorized user" }, { status: 401 }),
        origin
      );
    }

    const verify = await verifyExternalUser(token);
    if (!verify) {
      return withCorsHeaders(
        NextResponse.json({ error: "Unauthorized user" }, { status: 401 }),
        origin
      );
    }
    
    response.headers.append("user", JSON.stringify(verify));
    return response;
  }

  // Panel APIs
  if (pathname.startsWith("/api/panel")) {
    const token = request.headers.get("Authorization");
    const isValid = await VerifyPanelRequest(token);
    
    if (!isValid) {
      return withCorsHeaders(
        NextResponse.json({ error: "Unauthorized user" }, { status: 401 }),
        origin
      );
    }

    return response;
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
