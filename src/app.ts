import express from 'express';
import bodyParser from 'body-parser';
import blogsRouter from './routes/blogs';
import postsRouter from './routes/posts';
import { clearAllData } from './infrastructure/repositories/testingRepo';

const app = express();
app.use(bodyParser.json());

// 💡 ДОБАВЛЕННЫЙ КОРНЕВОЙ РОУТ (GET /)
app.get('/', (req, res) => {
    res.status(200).send({
        status: 'OK',
        message: 'Welcome to the API! Use /blogs or /posts.'
    });
});

// роуты
// Изменено: Убран префикс '/api' для соответствия тестам
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);

// очистка базы
// Изменено: Убран префикс '/api' для соответствия тестам (DELETE /testing/all-data)
app.delete('/testing/all-data', (req, res) => {
    clearAllData();
    // Тесты ожидают статус 204
    res.sendStatus(204);
});

export default app;