//src\infrastructure\repositories\postsRepo.ts
import { Blog } from '../types/Blog';

let blogs: Blog[] = [];

export const blogsRepo = {
    getAll: () => blogs,
    getById: (id: string) => blogs.find(b => b.id === id),
    create: (data: Omit<Blog, 'id'>) => {
        const newBlog: Blog = { id: Date.now().toString(), ...data };
        blogs.push(newBlog);
        return newBlog;
    },
    update: (id: string, data: Omit<Blog, 'id'>) => {
        const index = blogs.findIndex(b => b.id === id);
        if (index === -1) return null;
        blogs[index] = { id, ...data };
        return blogs[index];
    },

    delete: (id: string) => {
        const index = blogs.findIndex(b => b.id === id);
        if (index === -1) return false;
        blogs.splice(index, 1);
        return true;
    },
    clear: () => { blogs = []; }
};
