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

const allowedOrigins = ["https://hostelhub.pk","https://www.hostelhub.pk", "http://localhost:3001","https://hostel-hub-control-panel.vercel.app"];

export async function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") || "";
  const pathname = request.nextUrl.pathname;

  if (request.method === "OPTIONS") {
    
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-token",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }

  const response = NextResponse.next();

  if (allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  const isPublicRoute = publicRoutes.some((route) => pathname == route);
  if (isPublicRoute) return response;

  if (pathname.startsWith("/admin") && pathname !== "/admin-portal-login") {
    const session = await getSession();
    if (!session) {
      return NextResponse.redirect(new URL("/admin-portal-login", request.url));
    }
  }

 

  if(pathname.startsWith('/api/students')){
    let token = request?.headers?.get("authorization")
      
    if(!token){
      return NextResponse.json({error:"Unauthorized user"},{status:401})
    }
    let verify  = await verifyExternalUser(token)
    
    if(!verify ){
      return NextResponse.json({error:"Unauthorized user"},{status:401})
    }
    response.headers.append("user",JSON.stringify(verify))
  }
  
  // verify incoming request from control panel
  if(pathname.startsWith("/api/panel")){
    let token = request.headers.get("Authorization")
    
    let isValid = await VerifyPanelRequest(token)
    if(isValid){
      return response
      
    }else{
      return NextResponse.json({error:"Unauthorized user"},{status:401})
    }

  }
  
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
