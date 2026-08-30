import { connectDB } from "../src/lib/db/mongoose";
import { User } from "../src/server/models";

const email = process.argv[2]?.toLowerCase();
if (!email) { console.error("Usage: npm run make-admin -- you@email.com"); process.exit(1); }
connectDB().then(async () => {
  const r = await User.updateOne({ email }, { $addToSet: { roles: "admin" } });
  console.log(r.matchedCount ? `✓ ${email} is now an admin. Log out and back in.` : `No account with email ${email}. Register first.`);
  process.exit(0);
});
