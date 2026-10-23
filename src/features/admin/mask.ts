/** "minhanh.demo@example.com" → "mi***@example.com". Never returns the local part in full. */
export function maskEmail(email: string): string {
  const at = email.lastIndexOf("@");
  if (at <= 0) return "***";
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  // Show at most 2 chars and always hide at least one, so a 1-char local part stays hidden
  const visible = local.slice(0, Math.min(2, local.length - 1));
  return `${visible}***@${domain}`;
}
