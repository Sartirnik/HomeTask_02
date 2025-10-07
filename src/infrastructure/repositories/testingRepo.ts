import { blogsRepo } from './blogsRepo';
import { postsRepo } from './postsRepo';

export const clearAllData = () => {
    blogsRepo.clear();
    postsRepo.clear();
};
