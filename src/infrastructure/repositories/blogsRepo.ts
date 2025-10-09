import { Blog } from '../types/Blog';

// In-memory array для хранения блогов
let blogs: Blog[] = [];

export const blogsRepo = {
    /** Возвращает все блоги. */
    getAll: () => blogs,

    /** Находит блог по ID. */
    getById: (id: string) => blogs.find(b => b.id === id),

    /** Создает новый блог, присваивая ему уникальный ID. */
    create: (data: Omit<Blog, 'id'>) => {
        // ID генерируется на основе текущего времени.
        const newBlog: Blog = { id: Date.now().toString(), ...data };
        blogs.push(newBlog);
        return newBlog;
    },

    /** Обновляет существующий блог по ID. */
    update: (id: string, data: Omit<Blog, 'id'>) => {
        const index = blogs.findIndex(b => b.id === id);
        if (index === -1) return null;

        blogs[index] = { id, ...data };
        return blogs[index];
    },

    /** Удаляет блог по ID. */
    delete: (id: string) => {
        const index = blogs.findIndex(b => b.id === id);
        if (index === -1) return false;

        blogs.splice(index, 1);
        return true;
    },

    /** 💡 Функция для очистки данных. Критически важна для DELETE /testing/all-data. */
    clear: () => { blogs = []; }
};
