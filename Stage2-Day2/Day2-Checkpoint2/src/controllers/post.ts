import { Request, Response } from "express";
import { prisma } from "../connection/client";

// Get all posts
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({ include: { author: true } });
    res.status(200).json(posts);
  } catch {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// Get single post
export const getPost = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch {
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

// Create post
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, authorId } = req.body;

    if (!authorId || !title || !content) {
      return res.status(400).json({ error: "title, content, and authorId are required" });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: parseInt(authorId),
      },
    });

    res.status(201).json(post);
  } catch {
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Update post
export const updatePost = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;

    const post = await prisma.post.update({
      where: { id },
      data: { title, content },
    });

    res.status(200).json(post);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(500).json({ error: "Failed to update post" });
  }
};

// Delete post
export const deletePost = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.post.delete({ where: { id } });
    res.status(200).json({ message: "Post deleted" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(500).json({ error: "Failed to delete post" });
  }
};
