import { Request, Response, NextFunction } from 'express';
import {HttpStatus} from "../infrastructure/types/HttpStatus";

export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'];
    if (!auth) return res.sendStatus(HttpStatus.UNAUTHORIZED);

    // 1. Проверяем, что заголовок имеет схему 'Basic'
    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Basic') {
        // Если это не Basic (например, Bearer), возвращаем 401
        return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    const encoded = parts[1];

    // ... (остальной код для декодирования и проверки admin:qwerty)
    const decoded = Buffer.from(encoded, 'base64').toString();
    const [user, pass] = decoded.split(':');

    if (user === 'admin' && pass === 'qwerty') {
        return next();
    }

    // 2. Если учетные данные неверны
    return res.sendStatus(HttpStatus.UNAUTHORIZED);
};