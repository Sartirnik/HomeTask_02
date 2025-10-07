"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var port = 3001;
app_1.default.listen(port, function () {
    console.log("Server running on port ".concat(port));
});
//# sourceMappingURL=index.js.map