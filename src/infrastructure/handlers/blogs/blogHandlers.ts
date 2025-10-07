// src/handlers/blogsHandlers.ts (Предполагаемое имя файла)

import { Request, Response } from 'express';
// Предполагаем, что HttpStatus доступен по этому пути
import { HttpStatus } from '../../types/HttpStatus';
import { blogsRepo } from '../../repositories/blogsRepo';
import { Blog} from "../../types/Blog"; // Тип для готового объекта Blog

// 💡 Определение типа для входных данных блога (обязательно для типизации req.body)
interface BlogInputModel {
    name: string;
    description: string;
    websiteUrl: string;
}


// ---
// ## Обработчики роутов
// ---

// Получить все блоги
export const getAllBlogs = (req: Request, res: Response) => {
    const blogs = blogsRepo.getAll();
    // Используем HttpStatus.OK
    res.status(HttpStatus.OK).send(blogs);
};

// Получить блог по ID
export const getBlogById = (req: Request, res: Response) => {
    const blog = blogsRepo.getById(req.params.id);
    // Используем HttpStatus.NOT_FOUND
    if (!blog) return res.sendStatus(HttpStatus.NOT_FOUND);
    // Используем HttpStatus.OK
    res.status(HttpStatus.OK).send(blog);
};

// Создать новый блог
export const createBlog = (req: Request<{}, {}, BlogInputModel>, res: Response) => {
    const { name, description, websiteUrl } = req.body;

    // В рабочем проекте этот блок должен быть заменен middleware-валидацией (например, express-validator)
    if (!name || !description || !websiteUrl) {
        // Используем HttpStatus.BAD_REQUEST
        return res.status(HttpStatus.BAD_REQUEST).send({
            errorsMessages: [
                {
                    message: 'Invalid data',
                    field: 'name/description/websiteUrl'
                },
            ],
        });
    }

    const newBlog = blogsRepo.create({ name, description, websiteUrl });
    // Используем HttpStatus.CREATED
    res.status(HttpStatus.CREATED).send(newBlog);
};

// Обновить блог
export const updateBlog = (req: Request<{id: string}, {}, BlogInputModel>, res: Response) => {
    const { name, description, websiteUrl } = req.body;

    // В рабочем проекте также нужна валидация req.body перед обновлением.

    const updated = blogsRepo.update(req.params.id, { name, description, websiteUrl });
    // Используем HttpStatus.NOT_FOUND
    if (!updated) return res.sendStatus(HttpStatus.NOT_FOUND);
    // Используем HttpStatus.NO_CONTENT
    res.sendStatus(HttpStatus.NO_CONTENT);
};

// Удалить блог
export const deleteBlog = (req: Request, res: Response) => {
    const deleted = blogsRepo.delete(req.params.id);
    // Используем HttpStatus.NOT_FOUND
    if (!deleted) return res.sendStatus(HttpStatus.NOT_FOUND);
    // Используем HttpStatus.NO_CONTENT
    res.sendStatus(HttpStatus.NO_CONTENT);
};