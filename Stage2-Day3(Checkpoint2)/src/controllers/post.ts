import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true }, // supaya bisa lihat data user
    });
    res.json({ code: 200, status: "success", data: posts });
  } catch (error) {
    res.status(500).json({ code: 500, status: "error", message: error });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: { author: true },
    });
    res.json({ code: 200, status: "success", data: post });
  } catch (error) {
    res.status(500).json({ code: 500, status: "error", message: error });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const { title, content, category, authorId } = req.body;
  try {
    const post = await prisma.post.create({
      data: { title, content, category, authorId },
    });
    res.json({ code: 201, status: "success", data: post });
  } catch (error) {
    res.status(500).json({ code: 500, status: "error", message: error });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, category } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { title, content, category },
    });
    res.json({ code: 200, status: "success", data: post });
  } catch (error) {
    res.status(500).json({ code: 500, status: "error", message: error });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({ where: { id: parseInt(id) } });
    res.json({ code: 200, status: "success", message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ code: 500, status: "error", message: error });
  }
};

export const getCommentsByPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;
  const skip = (page - 1) * limit;

  try {
    const totalComments = await prisma.comment.count({
      where: { postId: parseInt(id) },
    });

    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(id) },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    res.json({
      code: 200,
      status: "success",
      totalComments,
      page,
      limit,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({ code: 500, status: "error", message: error });
  }
};

