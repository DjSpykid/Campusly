import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/server/models/User";
import type { RegisterInput } from "@/lib/validation/auth";
import type { Role } from "@/config/roles";

export type SessionUser = { id: string; name: string; email: string; roles: Role[] };

function toSessionUser(u: { _id: unknown; name: string; email: string; roles: string[] }): SessionUser {
  return { id: String(u._id), name: u.name, email: u.email, roles: Array.from(u.roles) as Role[] };
}

export async function registerUser(input: RegisterInput): Promise<{ ok: true; user: SessionUser } | { ok: false; error: string }> {
  await connectDB();
  const exists = await User.exists({ email: input.email.toLowerCase() });
  if (exists) return { ok: false, error: "An account with this email already exists." };
  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await User.create({ ...input, passwordHash, roles: ["customer"] });
  return { ok: true, user: toSessionUser(user) };
}

export async function verifyCredentials(email: string, password: string): Promise<SessionUser | null> {
  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? toSessionUser(user) : null;
}

export async function addRole(userId: string, role: Role) {
  await connectDB();
  await User.updateOne({ _id: userId }, { $addToSet: { roles: role } });
}
