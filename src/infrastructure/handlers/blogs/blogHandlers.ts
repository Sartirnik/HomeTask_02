import { Request, Response } from 'express';
import { blogsRepo } from '../../repositories/blogsRepo';

export type Blog = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
};


// Получить все блоги
export const getAllBlogs = (req: Request, res: Response) => {
    const blogs = blogsRepo.getAll();
    res.status(200).send(blogs);
};

// Получить блог по ID
export const getBlogById = (req: Request, res: Response) => {
    const blog = blogsRepo.getById(req.params.id);
    if (!blog) return res.sendStatus(404);
    res.status(200).send(blog);
};

// Создать новый блог
export const createBlog = (req: Request, res: Response) => {
    const { name, description, websiteUrl } = req.body;
    if (!name || !description || !websiteUrl) {
        return res.status(400).send({
            errorsMessages: [
                { message: 'Invalid data',
                    field: 'name/description/websiteUrl'
                },
            ],
        });
    }
    const newBlog = blogsRepo.create({ name, description, websiteUrl });
    res.status(201).send(newBlog);
};

// Обновить блог
export const updateBlog = (req: Request, res: Response) => {
    const { name, description, websiteUrl } = req.body;
    const updated = blogsRepo.update(req.params.id, { name, description, websiteUrl });
    if (!updated) return res.sendStatus(404);
    res.sendStatus(204);
};

// Удалить блог
export const deleteBlog = (req: Request, res: Response) => {
    const deleted = blogsRepo.delete(req.params.id);
    if (!deleted) return res.sendStatus(404);
    res.sendStatus(204);
};
