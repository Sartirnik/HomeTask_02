// src/routes/posts.ts

import { Router } from 'express';
import { basicAuth } from '../middlewares/auth';
import {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    postValidation,
    handleValidationErrors
} from '../infrastructure/handlers/post/postHandlers'; // Убедитесь, что путь верный!

const router = Router();

// GET all posts
router.get('/', getPosts);

// GET post by ID
router.get('/:id', getPostById);

// POST new post (с Basic Auth, валидацией и обработкой ошибок)
router.post(
    '/',
    basicAuth,
    ...postValidation,
    handleValidationErrors,
    createPost
);

// PUT update post by ID (с Basic Auth, валидацией и обработкой ошибок)
router.put(
    '/:id',
    basicAuth,
    ...postValidation,
    handleValidationErrors,
    updatePost
);

// DELETE post by ID
router.delete('/:id', basicAuth, deletePost);

export default router;