"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var blogs_1 = __importDefault(require("./routes/blogs"));
var posts_1 = __importDefault(require("./routes/posts"));
var testingRepo_1 = require("./infrastructure/repositories/testingRepo");
var app = (0, express_1.default)();
app.use(body_parser_1.default.json());
// роуты
app.use('/api/blogs', blogs_1.default);
app.use('/api/posts', posts_1.default);
// очистка базы
app.delete('/api/testing/all-data', function (req, res) {
    (0, testingRepo_1.clearAllData)();
    res.sendStatus(204);
});
exports.default = app;
//# sourceMappingURL=app.js.map