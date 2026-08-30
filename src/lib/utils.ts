export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
export const naira = (n: number) => "₦" + n.toLocaleString("en-NG");
