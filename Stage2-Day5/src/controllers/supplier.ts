import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

// POST /suppliers/login
export const handleSupplierLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role !== "SUPPLIER") {
      return res.status(401).json({ message: "Invalid credentials or not a supplier" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id: user.id, role: user.role });
    res.json({ token, role: user.role });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
