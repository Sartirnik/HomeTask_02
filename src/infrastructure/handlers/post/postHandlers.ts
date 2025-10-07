// src/handlers/postsHandlers.ts

import { Request, Response, NextFunction } from 'express';
import { body, validationResult, FieldValidationError } from 'express-validator';
import { postsRepo} from "../../repositories/postsRepo";
import { blogsRepo} from "../../repositories/blogsRepo";
import { Post } from  "../../types/Post";
import { HttpStatus} from "../../types/HttpStatus";

/**
 * Перечисление статусов HTTP для повышения читаемости кода.
 */

/**
 * Валидация полей поста (Middleware)
 */
export const postValidation = [
    body('title')
        .isString().withMessage('Title must be a string')
        .trim()
        .isLength({ min: 1, max: 30 }).withMessage('Title length should be 1-30 chars'),

    body('shortDescription')
        .isString().withMessage('Short description must be a string')
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('Short description length should be 1-100 chars'),

    body('content')
        .isString().withMessage('Content must be a string')
        .trim()
        .isLength({ min: 1, max: 1000 }).withMessage('Content length should be 1-1000 chars'),

    body('blogId')
        .isString().withMessage('blogId must be a string')
        .custom(id => {
            if (!blogsRepo.getById(id)) {
                throw new Error('Blog not found');
            }
            return true;
        }),
];

/**
 * Универсальный middleware для обработки ошибок валидации
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => {
            const isFieldValidationError = 'path' in err;

            return {
                // Используем 'path' для имени поля
                field: isFieldValidationError ? (err as FieldValidationError).path : 'unknown',
                message: err.msg,
            };
        });

        // Убираем дубликаты по полю
        const uniqueErrors = Array.from(
            new Map(formattedErrors.map(e => [e.field, e])).values()
        );

        // Использование HttpStatus.BAD_REQUEST
        return res.status(HttpStatus.BAD_REQUEST).send({ errorsMessages: uniqueErrors });
    }
    next();
};

// ---
// ## Обработчики роутов
// ---

export const getPosts = (req: Request, res: Response) => {
    // Использование HttpStatus.OK
    res.status(HttpStatus.OK).send(postsRepo.getAll());
};

export const getPostById = (req: Request, res: Response) => {
    const post = postsRepo.getById(req.params.id);
    // Использование HttpStatus.NOT_FOUND
    if (!post) return res.sendStatus(HttpStatus.NOT_FOUND);
    // Использование HttpStatus.OK
    res.status(HttpStatus.OK).send(post);
};

export const createPost = (req: Request<{}, {}, Post>, res: Response) => {
    const newPost = postsRepo.create(req.body);
    // Использование HttpStatus.CREATED
    res.status(HttpStatus.CREATED).send(newPost);
};

export const updatePost = (req: Request<{id: string}, {}, Post>, res: Response) => {
    const updated = postsRepo.update(req.params.id, req.body);
    // Использование HttpStatus.NOT_FOUND
    if (!updated) return res.sendStatus(HttpStatus.NOT_FOUND);
    // Использование HttpStatus.NO_CONTENT
    res.sendStatus(HttpStatus.NO_CONTENT);
};

export const deletePost = (req: Request, res: Response) => {
    const deleted = postsRepo.delete(req.params.id);
    // Использование HttpStatus.NOT_FOUND
    if (!deleted) return res.sendStatus(HttpStatus.NOT_FOUND);
    // Использование HttpStatus.NO_CONTENT
    res.sendStatus(HttpStatus.NO_CONTENT);
};