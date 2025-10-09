import { Request, Response, NextFunction } from 'express';
import { body, validationResult, FieldValidationError } from 'express-validator';
import { postsRepo} from "../../repositories/postsRepo";
import { blogsRepo} from "../../repositories/blogsRepo";
import { Post } from  "../../types/Post";
import { HttpStatus} from "../../types/HttpStatus";

// --- (Валидация postValidation и handleValidationErrors остаются БЕЗ ИЗМЕНЕНИЙ) ---
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
                field: isFieldValidationError ? (err as FieldValidationError).path : 'unknown',
                message: err.msg,
            };
        });

        const uniqueErrors = Array.from(
            new Map(formattedErrors.map(e => [e.field, e])).values()
        );

        return res.status(HttpStatus.BAD_REQUEST).send({ errorsMessages: uniqueErrors });
    }
    next();
};

// ---
// ## Обработчики роутов (ЛОГИКА ИЗМЕНЕНА)
// ---

export const getPosts = (req: Request, res: Response) => {
    res.status(HttpStatus.OK).send(postsRepo.getAll());
};

export const getPostById = (req: Request, res: Response) => {
    const post = postsRepo.getById(req.params.id);
    if (!post) return res.sendStatus(HttpStatus.NOT_FOUND);
    res.status(HttpStatus.OK).send(post);
};

export const createPost = (req: Request<{}, {}, Post>, res: Response) => {
    const { title, shortDescription, content, blogId } = req.body;

    // 💡 1. Находим блог, чтобы получить blogName (валидатор уже проверил, что он существует)
    const blog = blogsRepo.getById(blogId);

    // Эта проверка нужна, чтобы TypeScript знал, что blog существует.
    if (!blog) return res.sendStatus(HttpStatus.NOT_FOUND);

    // 💡 2. Формируем полную модель поста, включая blogName
    const postDataToCreate = {
        title,
        shortDescription,
        content,
        blogId,
        blogName: blog.name // 👈 ДОБАВЛЕНО
    };

    const newPost = postsRepo.create(postDataToCreate);
    res.status(HttpStatus.CREATED).send(newPost);
};

export const updatePost = (req: Request<{id: string}, {}, Post>, res: Response) => {
    const { title, shortDescription, content, blogId } = req.body;

    let blogName = req.body.blogName; // Начинаем с того, что пришло в теле запроса

    // 💡 1. Если в запросе есть blogId, мы должны убедиться, что blogName соответствует
    // (и что blogId валиден, что уже проверено middleware)
    if (blogId) {
        const blog = blogsRepo.getById(blogId);
        if (blog) {
            blogName = blog.name; // Заменяем blogName на актуальное из репозитория
        }
    }

    const postDataToUpdate = { title, shortDescription, content, blogId, blogName };

    const updated = postsRepo.update(req.params.id, postDataToUpdate);
    if (!updated) return res.sendStatus(HttpStatus.NOT_FOUND);
    res.sendStatus(HttpStatus.NO_CONTENT);
};

export const deletePost = (req: Request, res: Response) => {
    const deleted = postsRepo.delete(req.params.id);
    if (!deleted) return res.sendStatus(HttpStatus.NOT_FOUND);
    res.sendStatus(HttpStatus.NO_CONTENT);
};
