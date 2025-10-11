import { Request, Response, NextFunction } from 'express';
import { body, validationResult, FieldValidationError } from 'express-validator';
// Предполагается, что эти импорты корректны для вашей структуры
import { blogsRepo } from '../../repositories/blogsRepo';
import { HttpStatus } from '../../types/HttpStatus';
import { Blog } from "../../types/Blog";

interface BlogInputModel {
    name: string;
    description: string;
    websiteUrl: string;
}

// ---
// ## Middleware для валидации и обработки ошибок
// ---

/**
 * Валидация полей блога (Middleware)
 * * Добавлена .exists({ checkFalsy: true }) для проверки обязательного наличия поля
 * и его непустого значения.
 */
export const blogValidation = [
    // name: string, 1-15 chars. Обязательное поле.
    body('name')
        .exists().withMessage('Name is required') // Проверка на наличие поля в теле
        .notEmpty().withMessage('Name cannot be empty') // Проверка, что не является пустой строкой
        .isString().withMessage('Name must be a string')
        .trim()
        .isLength({ min: 1, max: 15 }).withMessage('Name length should be 1-15 chars'),

    // description: string, 1-500 chars. Обязательное поле.
    body('description')
        .exists().withMessage('Description is required')
        .notEmpty().withMessage('Description cannot be empty')
        .isString().withMessage('Description must be a string')
        .trim()
        .isLength({ min: 1, max: 500 }).withMessage('Description length should be 1-500 chars'),

    // websiteUrl: string, must be a valid URL, 1-100 chars. Обязательное поле.
    body('websiteUrl')
        .exists().withMessage('Website URL is required')
        .notEmpty().withMessage('Website URL cannot be empty')
        .isString().withMessage('Website URL must be a string')
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('Website URL length should be 1-100 chars')
        .isURL().withMessage('Website URL must be a valid URL'),
];
/**
 * Универсальный middleware для обработки ошибок валидации (Status 400)
 * * ВАЖНО: Удалена дублирующаяся функция из оригинального кода.
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => {
            // express-validator 6+ использует 'path' для FieldValidationError
            const isFieldValidationError = 'path' in err;

            return {
                field: isFieldValidationError ? (err as FieldValidationError).path : 'unknown',
                message: err.msg,
            };
        });

        // Убираем дубликаты сообщений об ошибках по имени поля
        const uniqueErrors = Array.from(
            new Map(formattedErrors.map(e => [e.field, e])).values()
        );

        return res.status(HttpStatus.BAD_REQUEST).send({ errorsMessages: uniqueErrors });
    }
    next();
};

// ---
// ## Обработчики роутов
// ---

// Получить все блоги
export const getAllBlogs = (req: Request, res: Response) => {
    const blogs = blogsRepo.getAll();
    res.status(HttpStatus.OK).send(blogs);
};

// Получить блог по ID
export const getBlogById = (req: Request, res: Response) => {
    const blog = blogsRepo.getById(req.params.id);
    if (!blog) return res.sendStatus(HttpStatus.NOT_FOUND);
    res.status(HttpStatus.OK).send(blog);
};

// Создать новый блог
export const createBlog = (req: Request<{}, {}, BlogInputModel>, res: Response) => {
    const { name, description, websiteUrl } = req.body;

    const newBlog = blogsRepo.create({ name, description, websiteUrl });
    res.status(HttpStatus.CREATED).send(newBlog);
};

// Обновить блог
export const updateBlog = (req: Request<{id: string}, {}, BlogInputModel>, res: Response) => {
    const { name, description, websiteUrl } = req.body;

    const updated = blogsRepo.update(req.params.id, { name, description, websiteUrl });
    if (!updated) return res.sendStatus(HttpStatus.NOT_FOUND);
    res.sendStatus(HttpStatus.NO_CONTENT);
};

// Удалить блог
export const deleteBlog = (req: Request, res: Response) => {
    const deleted = blogsRepo.delete(req.params.id);
    if (!deleted) return res.sendStatus(HttpStatus.NOT_FOUND);
    res.sendStatus(HttpStatus.NO_CONTENT);
};