import { Router } from 'express';
import { basicAuth } from '../middlewares/auth';
import {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
} from '../infrastructure/handlers/blogs/blogHandlers';

const router = Router();

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/', basicAuth, createBlog);
router.put('/:id', basicAuth, updateBlog);
router.delete('/:id', basicAuth, deleteBlog);

export default router;

