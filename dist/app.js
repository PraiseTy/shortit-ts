"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT
    ? Number.parseInt(process.env.PORT, 10)
    : 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.get("/", (request, response) => {
    response.json({ msg: "Initial Commit" });
});
const start = () => {
    try {
        app.listen(port, () => console.log(`Server is listening on port ${port}...`));
    }
    catch (error) {
        console.log(error);
    }
};
start();
