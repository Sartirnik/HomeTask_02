import { Post } from '../types/Post';

// In-memory array для хранения постов
let posts: Post[] = [];

export const postsRepo = {
    /** Возвращает все посты. */
    getAll: () => posts,

    /** Находит пост по ID. */
    getById: (id: string) => posts.find(p => p.id === id),

    /** Создает новый пост, присваивая ему уникальный ID. */
    create: (data: Omit<Post, 'id'>) => {
        // ID генерируется на основе текущего времени.
        const newPost: Post = { id: Date.now().toString(), ...data };
        posts.push(newPost);
        return newPost;
    },

    /** Обновляет существующий пост по ID. */
    update: (id: string, data: Omit<Post, 'id'>) => {
        const index = posts.findIndex(p => p.id === id);
        if (index === -1) return null;

        // Обновляем пост, сохраняя его ID
        posts[index] = { id, ...data };
        return posts[index];
    },

    /** Удаляет пост по ID. */
    delete: (id: string) => {
        const index = posts.findIndex(p => p.id === id);
        if (index === -1) return false;

        posts.splice(index, 1);
        return true;
    },

    /** Очищает массив постов. Критически важна для DELETE /testing/all-data. */
    clear: () => { posts = []; }
};
