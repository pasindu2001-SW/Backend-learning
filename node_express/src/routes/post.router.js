import { Router } from "express";
import { createPost, getAllPosts, updatePost, deletePost } from "../controllers/post.controller.js";

const router = Router();

router.route('/create').post(createPost);
router.route('/all').get(getAllPosts);
router.route('/update/:id').patch(updatePost);
router.route('/delete/:id').delete(deletePost);

export default router;