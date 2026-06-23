import crypto from 'crypto';

// In-memory token store — in production, use a database
// Tokens: token -> { email, expires }
const resetTokens = new Map<string, { email: string; expires: number }>();

// Clean up expired tokens every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of resetTokens.entries()) {
    if (data.expires < now) resetTokens.delete(token);
  }
}, 10 * 60 * 1000);

export function generateResetToken(email: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + 60 * 60 * 1000; // 1 hour
  resetTokens.set(token, { email, expires });
  return token;
}

export function validateResetToken(token: string): { email: string } | null {
  const data = resetTokens.get(token);
  if (!data) return null;
  if (data.expires < Date.now()) {
    resetTokens.delete(token);
    return null;
  }
  return { email: data.email };
}

export function consumeResetToken(token: string): string | null {
  const data = validateResetToken(token);
  if (!data) return null;
  resetTokens.delete(token);
  return data.email;
}
