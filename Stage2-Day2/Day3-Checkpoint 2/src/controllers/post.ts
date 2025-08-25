import { Request, Response } from "express";
import { prisma } from "../prisma/client";

// GET semua post
export const getPosts = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const posts = await prisma.post.findMany({
      where: category ? { category: String(category) } : {},
      include: { author: true },
    });

    res.json({ code: 200, status: "success", data: posts });
  } catch (error: any) {
    res.status(500).json({ code: 500, status: "error", message: error.message });
  }
};

// GET post by ID
export const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: { author: true },
    });
    res.json({ code: 200, status: "success", data: post });
  } catch (error: any) {
    res.status(500).json({ code: 500, status: "error", message: error.message });
  }
};

// CREATE post
export const createPost = async (req: Request, res: Response) => {
  const { title, content, category, authorId } = req.body;
  try {
    const post = await prisma.post.create({
      data: { title, content, category, authorId },
    });
    res.json({ code: 201, status: "success", data: post });
  } catch (error: any) {
    res.status(500).json({ code: 500, status: "error", message: error.message });
  }
};

// UPDATE post
export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, category } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { title, content, category },
    });
    res.json({ code: 200, status: "success", data: post });
  } catch (error: any) {
    res.status(500).json({ code: 500, status: "error", message: error.message });
  }
};

// DELETE post
export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({ where: { id: parseInt(id) } });
    res.json({ code: 200, status: "success", message: "Post deleted" });
  } catch (error: any) {
    res.status(500).json({ code: 500, status: "error", message: error.message });
  }
};

// GET comments by post (with pagination)
export const getCommentsByPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;
  const skip = (page - 1) * limit;

  try {
    const totalComments = await prisma.comment.count({
      where: { postId: parseInt(id) },
    });

    const totalPages = Math.ceil(totalComments / limit);

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
      totalPages,
      page,
      limit,
      data: comments,
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, status: "error", message: error.message });
  }
};

// CREATE comment for a post
export const createComment = async (req: Request, res: Response) => {
  const { id } = req.params; // postId
  const { content } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(id),
      },
    });

    res.json({ code: 201, status: "success", data: comment });
  } catch (error: any) {
    res.status(500).json({ code: 500, status: "error", message: error.message });
  }
};

// GET summary of comments per post (with pagination & filter)
export const getCommentsSummary = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const minComments = parseInt(req.query.minComments as string) || 0;

    const skip = (page - 1) * limit;

    // ambil data posts dengan hitungan komentar
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        _count: { select: { comments: true } },
      },
      skip,
      take: limit,
      orderBy: { id: "asc" }, // bisa ubah jadi createdAt kalau ada field
    });

    // filter hanya yang jumlah komentar > minComments
    const filtered = posts.filter((p) => p._count.comments > minComments);

    // hitung total data untuk pagination
    const totalPosts = await prisma.post.count();
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      code: 200,
      status: "success",
      page,
      limit,
      minComments,
      totalPages,
      data: filtered.map((p) => ({
        postId: p.id,
        title: p.title,
        totalComments: p._count.comments,
      })),
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ code: 500, status: "error", message: error.message });
  }
};
