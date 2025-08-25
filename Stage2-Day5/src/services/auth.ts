import { prisma } from "../prisma/client";
import bcrypt from "bcrypt";
import { generateToken, UserPayload } from "../utils/jwt";

/**
 * REGISTER user baru
 * @param email 
 * @param password 
 * @param role default USER, bisa SUPPLIER
 */
export async function registerUser(
  email: string,
  password: string,
  role: "USER" | "SUPPLIER" = "USER"
) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already registered");

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed, role },
    select: { id: true, role: true }
  });

  return user;
}

/**
 * LOGIN user
 * @param email 
 * @param password 
 */
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid email or password");

  const payload: UserPayload = { id: user.id, role: user.role };
  return generateToken(payload);
}
