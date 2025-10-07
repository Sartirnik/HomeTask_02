"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const blogs_1 = __importDefault(require("./routes/blogs"));
const posts_1 = __importDefault(require("./routes/posts"));
const testingRepo_1 = require("./infrastructure/repositories/testingRepo");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
// 💡 ДОБАВЛЕННЫЙ КОРНЕВОЙ РОУТ (GET /)
app.get('/', (req, res) => {
    res.status(200).send({
        status: 'OK',
        message: 'Welcome to the API! Use /api/blogs or /api/posts.'
    });
});
// роуты
app.use('/api/blogs', blogs_1.default);
app.use('/api/posts', posts_1.default);
// очистка базы
app.delete('/api/testing/all-data', (req, res) => {
    (0, testingRepo_1.clearAllData)();
    res.sendStatus(204);
});
exports.default = app;
//# sourceMappingURL=app.js.map