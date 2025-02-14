import express from "express";
import 'dotenv/config'
import postgres from "postgres";
import Controller from "./controller/controller.js";
import { todosMiddleware } from "./service/service.js";
import cookieSession from "cookie-session";
import cors from 'cors';

// console.log(process.env);
// Log to check if environment variables are loaded
console.log("DATABASE_URL:", process.env.DATABASE_URI);
console.log("PORT:", process.env.PORT);

const sql = postgres(process.env.DATABASE_URL);

let app = express();
let controller = new Controller(sql);
app.use(
  cors({
    origin: ["https://monkeydoweb.vercel.app", 'http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIES_KEY1, process.env.COOKIES_KEY2],
    maxAge: 10 * 60 * 60 * 1000, // 10 hours
    sameSite: "none",
    secure: false,
    httpOnly: true,
  })
);

// Routes
app.post("/api/v1/register", (req, res) => controller.PostRegister(req, res));
app.post("/api/v1/login", (req, res) => controller.PostLogin(req, res));
app.use("/api/v1/todos", todosMiddleware);
app.get("/api/v1/todos", (req, res) => controller.GetTodos(req, res));
app.post("/api/v1/todos", (req, res) => controller.PostTodos(req, res));
app.get("/api/v1/todos/:id", (req, res) => controller.GetTodosById(req, res));
app.put("/api/v1/todos/:id", (req, res) => controller.UpdateTodosById(req, res));
app.delete("/api/v1/todos/:id", (req, res) => controller.DeleteTodosById(req, res));

// Use PORT from env or default to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
