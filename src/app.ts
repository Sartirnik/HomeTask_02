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
        message: 'Welcome to the API! Use /api/blogs or /api/posts.'
    });
});

// роуты
app.use('/api/blogs', blogsRouter);
app.use('/api/posts', postsRouter);

// очистка базы
app.delete('/api/testing/all-data', (req, res) => {
    clearAllData();
    res.sendStatus(204);
});

export default app;
