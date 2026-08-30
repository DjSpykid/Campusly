import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getCart } from "@/server/services/cart";
import { CheckoutForm } from "./CheckoutForm";

export default async function CheckoutPage() {
  const u = await requireUser();
  const cart = await getCart(u.id);
  if (!cart.items.length) redirect("/cart");
  return <CheckoutForm cart={cart} />;
}
