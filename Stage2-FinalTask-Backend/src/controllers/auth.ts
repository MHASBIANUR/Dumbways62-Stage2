// src/controllers/auth.ts
import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { generateToken } from "../utils/jwt";

// POST /auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password isi dengan benar" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "Email sudah terdaftar" });

    const normalizedRole = (role || "USER").toString().toUpperCase();
    if (!["ADMIN", "USER"].includes(normalizedRole)) {
      return res.status(400).json({ message: "role must be ADMIN or USER" });
    }

    const hashed = await hashPassword(password);

    const profileImage = req.file ? req.file.filename : null;

    const user = await prisma.user.create({
      data: { 
        name, 
        email, 
        password: hashed, 
        role: normalizedRole,
        profileImage,  
      },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        role: true, 
        points: true,
        profileImage: true,
      },
    });

    return res.status(201).json({ message: "Pengguna berhasil terdaftar", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email and password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Kesalahan pada email / password" });

    const valid = await comparePassword(password, user.password);
    if (!valid) return res.status(400).json({ message: "Kesalahan pada password" });

    const token = generateToken({ userId: user.id, role: user.role });

     return res.json({
      message: "Login success",
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        points: user.points,
        profileImage: user.profileImage 
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Masukkan email dan password yang telah dibuat" });
  }
};

//  GET /auth/me 
export const me = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const u = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        role: true, 
        points: true,
        profileImage: true
      },
    });
    return res.json({ user: u });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
