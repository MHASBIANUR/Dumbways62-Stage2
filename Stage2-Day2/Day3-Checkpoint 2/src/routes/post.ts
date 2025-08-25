import { Router } from "express";
import { getPosts, getPostById, createPost, updatePost, deletePost, getCommentsByPost, createComment, getCommentsSummary 
} from "../controllers/post";

const router = Router();

router.get("/", getPosts);
router.get("/:id/comments", getCommentsByPost);
router.get("/comments-summary", getCommentsSummary);
router.post("/:id/comments", createComment);

router.get("/:id", getPostById);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;


