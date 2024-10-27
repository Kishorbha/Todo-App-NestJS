export function escSpecialChars(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim()
}
