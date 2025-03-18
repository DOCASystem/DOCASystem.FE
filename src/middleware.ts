import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_CORS_HEADERS } from "./utils/api-config";

// Protected paths that require authentication
const PROTECTED_PATHS = [
  "/admin",
  "/products-management",
  "/orders-management",
  "/blog-management",
  "/users-management",
];

// Authentication paths for unauthenticated users
const AUTH_PATHS = ["/login", "/signup", "/forgot-password"];

// API paths that don't require authentication
const API_PATHS = ["/api/", "/swagger/", "/next/data/"];

// Danh sách các IP được phép truy cập admin (tùy chọn)
// const ALLOWED_IPS = ['127.0.0.1', '::1']; // Chỉ localhost

// Middleware function
export function middleware(request: NextRequest) {
  // Get current path
  const { pathname } = request.nextUrl;

  // Check if this is an API request
  const isApiRequest = API_PATHS.some((path) => pathname.startsWith(path));

  // If it's an API request, add CORS headers and continue
  if (isApiRequest) {
    return handleApiRequest();
  }

  // Handle OPTIONS request (CORS preflight)
  if (request.method === "OPTIONS") {
    return handleOptionsRequest();
  }

  // Skip during build process
  if (isInBuildProcess()) {
    return NextResponse.next();
  }

  // Get authentication state
  const token = request.cookies.get("token")?.value;
  const isAuthenticated = !!token;

  // Check if the path is protected
  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  // Check if the path is for authentication
  const isAuthPath = AUTH_PATHS.some((path) => pathname.startsWith(path));

  // If protected path and not authenticated, redirect to login
  if (isProtectedPath && !isAuthenticated) {
    return redirectToLogin(request);
  }

  // If authenticated and accessing auth paths, redirect to appropriate page
  if (isAuthPath && isAuthenticated) {
    return redirectAuthenticated(request);
  }

  // Add security headers to all responses
  return addSecurityHeaders();
}

// Handle API requests
function handleApiRequest() {
  const response = NextResponse.next();
  addCorsHeaders(response);
  return response;
}

// Handle OPTIONS requests
function handleOptionsRequest() {
  const response = new NextResponse(null, { status: 200 });
  addCorsHeaders(response);
  return response;
}

// Add CORS headers to response
function addCorsHeaders(response: NextResponse) {
  Object.keys(API_CORS_HEADERS).forEach((key) => {
    response.headers.set(
      key,
      API_CORS_HEADERS[key as keyof typeof API_CORS_HEADERS]
    );
  });
  return response;
}

// Check if running in build process
function isInBuildProcess() {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE === "phase-production-build"
  );
}

// Redirect to login page
function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.search = "";
  return NextResponse.redirect(loginUrl);
}

// Redirect authenticated user based on role
function redirectAuthenticated(request: NextRequest) {
  // Extract user data
  let isAdmin = false;
  try {
    const userDataCookie = request.cookies.get("userData")?.value;
    if (userDataCookie) {
      const userData = JSON.parse(decodeURIComponent(userDataCookie));
      const userRole = userData.role || "USER";
      isAdmin = userRole === "ADMIN" || userData.username === "admin";
    }
  } catch {
    // If error parsing user data, assume regular user
    isAdmin = false;
  }

  // Redirect based on role
  if (isAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  } else {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// Add security headers
function addSecurityHeaders() {
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  addCorsHeaders(response);
  return response;
}

// Matcher for paths that need middleware
export const config = {
  matcher: [
    // Admin routes
    "/admin/:path*",
    "/products-management/:path*",
    "/orders-management/:path*",
    "/blog-management/:path*",
    "/users-management/:path*",

    // Auth routes
    "/login",
    "/signup",
    "/forgot-password",

    // API routes
    "/api/:path*",
  ],
};
