// src\infrastructure\repositories\zzpostsRepo.ts
import { Post } from '../types/Post';

let posts: Post[] = [];

export const postsRepo = {
    getAll: () => posts,
    getById: (id: string) => posts.find(p => p.id === id),
    create: (data: Omit<Post, 'id'>) => {
        const newPost: Post = { id: Date.now().toString(), ...data };
        posts.push(newPost);
        return newPost;
    },
    update: (id: string, data: Omit<Post, 'id'>) => {
        const index = posts.findIndex(p => p.id === id);
        if (index === -1) return null;
        posts[index] = { id, ...data };
        return posts[index];
    },
    delete: (id: string) => {
        const index = posts.findIndex(p => p.id === id);
        if (index === -1) return false;
        posts.splice(index, 1);
        return true;
    },
    clear: () => { posts = []; }
};
