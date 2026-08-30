export const ROLES = ["customer", "seller", "provider", "runner", "admin"] as const;
export type Role = (typeof ROLES)[number];
