import argon2 from 'argon2';
export default class Repository {
    constructor(db) {
        this.db = db;
    }

    async PostRegister(req, res) {
        let json = req.body;
        let password_hash = await argon2.hash(json['password']);
        try {
            var result = await this.db`
            SELECT user_id
            FROM users 
            WHERE user_id = ${json['user_id']};`;
        } catch (err) {
            console.error(err);
            throw new Error("Error when accessing the database");
        }
        if(result.length != 0){
            throw new Error("An account with that user_id already exist");
        }
        try {
            await this.db`
            INSERT INTO 
            users(user_id, name, email, password_hash, updated_at) 
            VALUES(
                ${json['user_id']}, ${json['name']}, ${json['email']}, ${password_hash}, NOW()
            );`;
        } catch (err) {
            console.error(err);
            throw new Error("Error when performing user registration");
        }
        return;
    }

    async PostLogin(req, res) {
        let json = req.body;        
        try {
            const result = await this.db`
            SELECT password_hash
            FROM users 
            WHERE user_id = ${json['user_id']};`;
            if(result.length == 0){
                return false;
            }
            else return argon2.verify(result[0]['password_hash'], json['password']);
        } catch (err) {
            console.error(err);
            throw new Error("Error during login operation");
        }
    }

    async PostTodos(req, res) {
        let json = req.body;
        try {
            await this.db`
            INSERT INTO 
            todos(user_id, title, description, due_date, priority, is_complete, updated_at) 
            VALUES(
                ${req.session.user_id}, ${json['title']}, ${json['description']}, ${json['due_date']}, ${json['priority']}, 'false', NOW()
            );`;
        } catch (err) {
            console.error(err);
            throw new Error("Error when creating a new todo");
        }
        return;
    }

    async GetTodosById(req, res) {
        let todoId = req.params.todoId;
        try {
            const result = await this.db`
            SELECT * 
            FROM todos 
            WHERE todo_id = ${todoId}`;
            return result[0]; // Returns the first matching todo
        } catch (err) {
            console.error(err);
            throw new Error("Error when retrieving todo by ID");
        }
    }

    async UpdateTodosById(req, res) {
        let json = req.body;
        try {
            await this.db`
            UPDATE todos 
            SET 
                title = ${json['title']}, 
                description = ${json['description']}, 
                due_date = ${json['due_date']}, 
                priority = ${json['priority']}, 
                is_complete = ${json['is_complete']}, 
                updated_at = NOW()
            WHERE todo_id = ${req.params.todoId}`;
        } catch (err) {
            console.error(err);
            throw new Error("Error when updating todo by ID");
        }
        return;
    }

    async GetTodos(req, res) {
        try {
            const result = await this.db`
            SELECT * 
            FROM todos
            WHERE user_id=${req.session.user_id}`;
            return result; // Returns all todos
        } catch (err) {
            console.error(err);
            throw new Error("Error when retrieving all todos");
        }
    }

    async DeleteTodosById(req, res) {
        let todoId = req.params.todoId;
        try {
            await this.db`
            DELETE 
            FROM todos 
            WHERE todo_id = ${todoId}`;
        } catch (err) {
            console.error(err);
            throw new Error("Error when deleting todo by ID");
        }
        return;
    }
}
