import express from "express";
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import postgres from "postgres";
import Controller from "./controller/controller.js";
import { todosMiddleware } from "./service/service.js";

function dbErrorHandler(err){
    console.log('Error when querying the database');
    return 'There is an error when querying the database';    
}

let app = express()
const sql = postgres(dotenv.config('DATABASE_URL')['parsed']['DATABASE_URL']);
let controller = new Controller(sql);

app.use(express.json())
// Routes
app.post("/register", (req, res) => controller.PostRegister(req, res));
app.post("/login", (req, res) => controller.PostLogin(req, res));

// Apply middleware to /todos routes
app.use("/todos", todosMiddleware);

app.get("/todos", (req, res) => controller.GetTodos(req, res));
app.post("/todos", (req, res) => controller.PostTodos(req, res));
app.get("/todos/:id", (req, res) => controller.GetTodosById(req, res));
app.put("/todos/:id", (req, res) => controller.UpdateTodosById(req, res));
app.delete("/todos/:id", (req, res) => controller.DeleteTodosById(req, res));
app.listen(dotenv.config('PORT')['parsed']['PORT']);
