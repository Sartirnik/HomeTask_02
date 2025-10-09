import { Router } from 'express';
import { basicAuth } from '../middlewares/auth';
import {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
} from '../infrastructure/handlers/blogs/blogHandlers'; // Удален deleteAllEntities из импорта

const router = Router();

// Удален: router.delete('/testing/all-data', deleteAllEntities);
// Этот глобальный маршрут уже определен в app.ts

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/', basicAuth, createBlog);
router.put('/:id', basicAuth, updateBlog);
router.delete('/:id', basicAuth, deleteBlog);

export default router;