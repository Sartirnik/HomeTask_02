import { Router } from 'express';
import { basicAuth } from '../middlewares/auth';
// У вас был здесь неверный импорт, который вызвал ошибку
// import { blogValidation } from '../middlewares/blogValidation';
import {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    // Теперь добавим валидацию и обработчик из того же файла
    blogValidation, // <-- Добавьте это
    handleValidationErrors, // <-- И это
} from '../infrastructure/handlers/blogs/blogHandlers';

const router = Router();

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// --- ИСПРАВЛЕННЫЕ РОУТЫ ---
router.post('/',
    basicAuth,             // 1. Проверка аутентификации (401)
    blogValidation,        // 2. Сбор ошибок валидации
    handleValidationErrors,// 3. Возврат 400, если ошибки есть
    createBlog             // 4. Выполнение логики
);

router.put('/:id',
    basicAuth,
    blogValidation,
    handleValidationErrors, // <--- Добавлен обработчик ошибок
    updateBlog
);
// ----------------------------

router.delete('/:id', basicAuth, deleteBlog);

export default router;