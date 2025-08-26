import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

// POST /auth/register
export const handleRegister = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  if (!req.file) {
    res.status(400).json({ message: "no file uploaded"});
    return
  }
  const profile = req.file.filename;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // buat user
    const user = await prisma.user.create({
    data: {
    email,
    password: hashed,
    role: role === "SUPPLIER" ? "SUPPLIER" : "USER",
    profile: profile, // atau langsung profile aja
  },
});


    // kalau SUPPLIER, otomatis buat row di Supplier
    if (user.role === "SUPPLIER") {
      await prisma.supplier.create({
        data: {
          userId: user.id,
        },
      });
    }

    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// POST /auth/login
export const handleLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken({ id: user.id, role: user.role });
    res.json({ token, role: user.role });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
