import bcrypt from "bcryptjs";
import { connectDB } from "../src/lib/db/mongoose";
import { User, Business, Product, Service } from "../src/server/models";

const PASSWORD = process.env.SEED_PASSWORD ?? "campusly123";
const CAMPUS = process.env.NEXT_PUBLIC_CAMPUS_NAME || "Demo University";

async function upsertUser(name: string, email: string, roles: string[], phone = "08000000000") {
  const existing = await User.findOne({ email });
  if (existing) return existing;
  return User.create({ name, email, passwordHash: await bcrypt.hash(PASSWORD, 10), phone, campus: CAMPUS, roles });
}

type Seller = { name: string; email: string; biz: { name: string; type: string; category: string; location: string; description: string }; logo: string; cover: string; products: [string, number, string, string, string[]][]; services: [string, number, number, string, string, string[]][] };
const sellers: Seller[] = [
  { name: "Toke Adeyemi", email: "toke@campusly-demo.com", biz: { name: "Toke's Bakes", type: "both", category: "Cakes & Pastries", location: "Hall 3, Room 118", description: "Custom cakes, cupcakes, chin-chin and small chops made fresh in Hall 3. Order by 2pm for evening delivery." },
    logo: "/images/pastry-1.jpg", cover: "/images/cake-2.jpg",
    products: [["Chocolate drip cake (8″)", 12000, "Cakes & Pastries", "Rich chocolate sponge, ganache drip and buttercream swirls. Serves 8–10. Custom message on top for free.", ["/images/cake-1.jpg", "/images/cake-3.jpg", "/images/cake-4.jpg"]], ["Cinnamon rolls (6)", 2500, "Cakes & Pastries", "Soft, sugar-dusted, baked the morning you order.", ["/images/snack-1.jpg"]], ["Cupcakes (box of 6)", 4500, "Cakes & Pastries", "Vanilla, chocolate or mixed.", ["/images/cupcakes-1.jpg", "/images/cupcakes-2.jpg"]], ["Doughnuts (12)", 3000, "Food & Snacks", "Sugar-dusted, fried fresh every morning.", ["/images/doughnut-1.jpg"]]],
    services: [["Cake tasting session", 5000, 45, "Cakes & Pastries", "Taste 4 flavours before you order a custom cake.", ["/images/cake-2.jpg"]]] },
  { name: "Ama Nwosu", email: "ama@campusly-demo.com", biz: { name: "Nails by Ama", type: "services", category: "Nails", location: "Female Hostel B", description: "Gel sets, nail art and removal. Bring a reference picture." },
    logo: "/images/salon-1.jpg", cover: "/images/nails-2.jpg",
    products: [], services: [["Gel nails + art", 6500, 90, "Nails", "Full gel set with your choice of art. Removal included.", ["/images/nails-1.jpg", "/images/nails-2.jpg", "/images/nails-3.jpg"]], ["Classic manicure", 3500, 45, "Nails", "Shape, cuticle care and polish.", ["/images/nails-3.jpg"]]] },
  { name: "Segun Okafor", email: "segun@campusly-demo.com", biz: { name: "FixIt Campus", type: "services", category: "Repairs", location: "Engineering block", description: "Laptop and phone repairs. Free diagnosis when you book a fix." },
    logo: "/images/laptop-2.jpg", cover: "/images/laptop-1.jpg",
    products: [], services: [["Laptop / PC repair diagnosis", 2000, 30, "Repairs", "Find out what's wrong and get a quote. Free if you go ahead with the fix.", ["/images/laptop-1.jpg", "/images/laptop-2.jpg"]], ["Screen replacement (phone)", 15000, 60, "Repairs", "Most Android and iPhone models.", ["/images/phone-1.jpg"]]] },
  { name: "Femi Olu", email: "femi@campusly-demo.com", biz: { name: "Drip by Femi", type: "products", category: "Clothing", location: "Hall 2, Room 45", description: "Oversized tees, hoodies and caps. Campus drops every Friday." },
    logo: "/images/tee-2.jpg", cover: "/images/hoodie-2.jpg",
    products: [["Oversized campus tee", 8500, "Clothing", "Heavy cotton, boxy fit. S–XL.", ["/images/tee-1.jpg", "/images/tee-2.jpg"]], ["Hoodie (grey)", 15000, "Clothing", "Fleece-lined, oversized. Unisex.", ["/images/hoodie-1.jpg", "/images/hoodie-2.jpg"]], ["Gold bangle", 3500, "Accessories", "Gold-plated statement bangle. Gift-boxed.", ["/images/bracelet-1.jpg", "/images/bracelet-2.jpg"]]], services: [] },
  { name: "Mama T", email: "mamat@campusly-demo.com", biz: { name: "Mama T Kitchen", type: "products", category: "Food & Snacks", location: "Cafeteria block", description: "Hot meals delivered to your hall. Jollof, fried rice, swallow." },
    logo: "/images/food-1.jpg", cover: "/images/food-2.jpg",
    products: [["Peppered chicken stew + rice", 2500, "Food & Snacks", "Slow-cooked peppered stew over rice. Proper hostel dinner.", ["/images/jollof-1.jpg", "/images/food-2.jpg"]], ["Fried rice + turkey", 3000, "Food & Snacks", "Generous portion.", ["/images/friedrice-1.jpg"]], ["Grilled chicken bowl", 3500, "Food & Snacks", "Peppered, with plantain.", ["/images/food-1.jpg"]]], services: [] },
];

async function main() {
  await connectDB();
  await upsertUser("Campusly Admin", process.env.ADMIN_EMAIL ?? "admin@campusly-demo.com", ["customer", "admin"]);
  await upsertUser("Aisha Bello", "aisha@campusly-demo.com", ["customer"]);
  await upsertUser("John Kalu", "john@campusly-demo.com", ["customer", "runner"]);
  for (const s of sellers) {
    const roles = ["customer", ...(s.biz.type !== "services" ? ["seller"] : []), ...(s.biz.type !== "products" ? ["provider"] : [])];
    const owner = await upsertUser(s.name, s.email, roles);
    let biz = await Business.findOne({ ownerId: owner._id });
    if (!biz) {
      biz = await Business.create({ ...s.biz, ownerId: owner._id, slug: s.biz.name.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), contact: { phone: "08000000000", whatsapp: "08000000000" },
        logoUrl: s.logo, coverUrl: s.cover, availability: s.biz.type === "products" ? [] : [1, 2, 3, 4, 5, 6].map((day) => ({ day, start: "09:00", end: "18:00" })) });
    } else {
      await Business.updateOne({ _id: biz._id }, { $set: { logoUrl: s.logo, coverUrl: s.cover } });
    }
    for (const [name, price, category, description, images] of s.products) await Product.updateOne({ businessId: biz._id, name }, { $set: { price, category, description, images, inStock: true } }, { upsert: true });
    for (const [name, price, durationMins, category, description, images] of s.services) await Service.updateOne({ businessId: biz._id, name }, { $set: { price, durationMins, category, description, images, active: true } }, { upsert: true });
  }
  console.log(`Seeded. All demo accounts use password "${PASSWORD}".`);
  console.log("admin@campusly-demo.com (admin) · aisha@campusly-demo.com (customer) · john@campusly-demo.com (runner) · toke@campusly-demo.com (seller+provider) · ama@campusly-demo.com (provider)");
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
