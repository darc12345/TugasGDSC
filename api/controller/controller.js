import { Service } from './../service/service.js';

export default class Controller {
    constructor(db) {
        this.service = new Service(db);
    }

    async PostRegister(req, res) {
        try {
            const result = await this.service.PostRegister(req, res);
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async PostLogin(req, res) {
        try {
            const result = await this.service.PostLogin(req, res);
            if (!result) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async GetTodos(req, res) {
        try {
            const result = await this.service.GetTodos(req, res);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async PostTodos(req, res) {
        try {
            const result = await this.service.PostTodos(req, res);
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async GetTodosById(req, res) {
        try {
            const result = await this.service.GetTodosById(req, res);
            if (!result) {
                return res.status(404).json({ error: 'Todo not found' });
            }
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async UpdateTodosById(req, res) {
        try {
            const result = await this.service.UpdateTodosById(req, res);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async DeleteTodosById(req, res) {
        try {
            const result = await this.service.DeleteTodosById(req, res);
            return res.status(204).json(result); // 204 No Content
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
