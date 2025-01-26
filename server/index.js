import express from "express";
import dotenv from 'dotenv';
import postgres from "postgres";
import Controller from "./controller/controller.js";
import { todosMiddleware } from "./service/service.js";
import cookieSession from 'cookie-session';


let app = express()
const sql = postgres(dotenv.config('DATABASE_URL')['parsed']['DATABASE_URL']);
let controller = new Controller(sql);

app.use(express.json())
app.use(cookieSession({
    name: 'session',
    keys: [
        dotenv.config('COOKIES_KEY1')['parsed']['COOKIES_KEY1'],
        dotenv.config('COOKIES_KEY2')['parsed']['COOKIES_KEY2']
    ],
  
    // Cookie Options
    maxAge: 10 * 60 * 60 * 1000 // 24 hours
  }))

// Routes
app.post("api/v1/register", (req, res) => controller.PostRegister(req, res));
app.post("api/v1/login", (req, res) => controller.PostLogin(req, res));

// Apply middleware to /todos routes
app.use("api/v1/todos", todosMiddleware);

app.get("api/v1/todos", (req, res) => controller.GetTodos(req, res));
app.post("api/v1/todos", (req, res) => controller.PostTodos(req, res));
app.get("api/v1/todos/:id", (req, res) => controller.GetTodosById(req, res));
app.put("api/v1/todos/:id", (req, res) => controller.UpdateTodosById(req, res));
app.delete("api/v1/todos/:id", (req, res) => controller.DeleteTodosById(req, res));
app.listen(dotenv.config('PORT')['parsed']['PORT']);
