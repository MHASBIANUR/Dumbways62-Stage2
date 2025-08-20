import { Request, Response } from "express";
import { prisma } from "../connection/client";

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({ include: { posts: true } });
  res.json(users);
};

// Get single user
export const getUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    include: { posts: true }
  });
  res.json(user);
};

// ✅ Create user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const user = await prisma.user.create({
      data: { name }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  const user = await prisma.user.update({
    where: { id },
    data: { name }
  });
  res.json(user);
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await prisma.user.delete({ where: { id } });
  res.json({ message: "User deleted" });
};
