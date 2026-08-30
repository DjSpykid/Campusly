const BASE = "https://api.paystack.co";

function headers() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

export async function initializePayment(opts: { email: string; amountNgn: number; reference: string; callbackUrl: string; metadata?: Record<string, unknown> }) {
  const res = await fetch(`${BASE}/transaction/initialize`, {
    method: "POST", headers: headers(),
    body: JSON.stringify({ email: opts.email, amount: opts.amountNgn * 100, reference: opts.reference, callback_url: opts.callbackUrl, metadata: opts.metadata }),
  });
  const json = await res.json();
  if (!json.status) throw new Error(json.message ?? "Paystack initialize failed");
  return { authorizationUrl: json.data.authorization_url as string };
}

export async function verifyPayment(reference: string): Promise<{ success: boolean; amountNgn: number }> {
  const res = await fetch(`${BASE}/transaction/verify/${encodeURIComponent(reference)}`, { headers: headers(), cache: "no-store" });
  const json = await res.json();
  return { success: json.status === true && json.data?.status === "success", amountNgn: (json.data?.amount ?? 0) / 100 };
}

export async function verifyWebhookSignature(rawBody: string, signature: string | null) {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key || !signature) return false;
  const { createHmac } = await import("node:crypto");
  return createHmac("sha512", key).update(rawBody).digest("hex") === signature;
}

export const makeReference = (prefix: "ord" | "bk") => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
