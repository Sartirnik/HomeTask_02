import { Request, Response, NextFunction } from 'express';
import {HttpStatus} from "../infrastructure/types/HttpStatus";

export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'];
    if (!auth) return res.sendStatus(HttpStatus.UNAUTHORIZED);

    const encoded = auth.split(' ')[1];
    const decoded = Buffer.from(encoded, 'base64').toString();
    const [user, pass] = decoded.split(':');

    if (user === 'admin' && pass === 'qwerty') {
        return next();
    }
    return res.sendStatus(HttpStatus.UNAUTHORIZED);
};
