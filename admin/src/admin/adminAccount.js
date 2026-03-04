export const DEFAULT_ADMIN_EMAIL = "admin@ammaie.com";
export const DEFAULT_ADMIN_PASSWORD = "admin123";

export function isDefaultAdminEmail(email) {
  return email?.trim().toLowerCase() === DEFAULT_ADMIN_EMAIL;
}
