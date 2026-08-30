import { connectDB } from "@/lib/db/mongoose";
import { Cart, Product, Business } from "@/server/models";
import type { CartDTO } from "@/types";

export async function getCart(userId: string): Promise<CartDTO> {
  await connectDB();
  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) return { items: [], subtotal: 0 };
  const products = await Product.find({ _id: { $in: cart.items.map((i: { productId: unknown }) => i.productId) } });
  const biz = cart.businessId ? await Business.findById(cart.businessId, "name") : null;
  const items = cart.items.flatMap((i: { productId: unknown; qty: number }) => {
    const p = products.find((x) => String(x._id) === String(i.productId));
    return p ? [{ productId: String(p._id), name: p.name, qty: i.qty, unitPrice: p.price, image: p.images?.[0], inStock: p.inStock }] : [];
  });
  return { businessId: cart.businessId ? String(cart.businessId) : undefined, businessName: biz?.name, items, subtotal: items.reduce((s: number, i: { qty: number; unitPrice: number }) => s + i.qty * i.unitPrice, 0) };
}

export async function addToCart(userId: string, productId: string, qty = 1): Promise<{ replaced: boolean }> {
  await connectDB();
  const product = await Product.findById(productId);
  if (!product || !product.inStock) throw new Error("Product unavailable");
  const cart = (await Cart.findOne({ userId })) ?? new Cart({ userId, items: [] });
  let replaced = false;
  if (cart.businessId && String(cart.businessId) !== String(product.businessId) && cart.items.length) {
    cart.items = [];
    replaced = true;
  }
  cart.businessId = product.businessId;
  const existing = cart.items.find((i: { productId: unknown }) => String(i.productId) === productId);
  if (existing) existing.qty = Math.min(20, existing.qty + qty);
  else cart.items.push({ productId: product._id, qty: Math.max(1, qty) });
  await cart.save();
  return { replaced };
}

export async function setCartQty(userId: string, productId: string, qty: number) {
  await connectDB();
  const cart = await Cart.findOne({ userId });
  if (!cart) return;
  cart.items = cart.items.filter((i: { productId: unknown }) => String(i.productId) !== productId);
  if (qty > 0) cart.items.push({ productId, qty: Math.min(20, qty) });
  if (cart.items.length === 0) cart.businessId = undefined;
  await cart.save();
}

export async function clearCart(userId: string) {
  await connectDB();
  await Cart.updateOne({ userId }, { $set: { items: [], businessId: null } });
}
