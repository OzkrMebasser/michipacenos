
const ALLOWED_EMAILS = ['correo1@gmail.com', 'correo2@gmail.com'];

export function isAllowed(email: string | undefined) {
  return email ? ALLOWED_EMAILS.includes(email) : false;
}