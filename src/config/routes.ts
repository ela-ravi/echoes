/**
 * Application routes configuration
 * Centralized location for all route paths
 */

export const ROUTES = {
  // Public routes
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  // Authenticated routes
  DASHBOARD: "/dashboard",
  NEWS_LIST: "/news",
  NEWS_DETAIL: "/news/:id",
  PROFILE: "/profile",
  // Admin routes
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_SETTINGS: "/admin/settings",
  // Fallback route
  NOT_FOUND: "/404",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
