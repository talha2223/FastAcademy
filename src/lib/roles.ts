export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER'
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];

export function isAdminRole(role: unknown): role is typeof ROLES.ADMIN {
  return role === ROLES.ADMIN;
}
