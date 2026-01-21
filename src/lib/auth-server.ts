import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

// Use placeholder values during build if env vars are not set
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder.convex.cloud";
const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL || "https://placeholder.convex.site";

const authUtils = convexBetterAuthNextJs({
  convexUrl,
  convexSiteUrl,
});

export const {
  handler,
  preloadAuthQuery,
  isAuthenticated,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction,
} = authUtils;
