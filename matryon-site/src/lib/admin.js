export const ADMIN_EMAIL = 'admin@matryon.ru'

export function isAdminEmail(email) {
  return email?.toLowerCase() === ADMIN_EMAIL
}
