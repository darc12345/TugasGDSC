import Repo from './../repository/repository.js';
export class Service{
    Repo;
    constructor(db){
        this.Repo = new Repo(db);
    }
    async PostRegister(req, res){
        return await this.Repo.PostRegister(req,res);
    };
    async PostLogin(req, res){
        let isValid =  await this.Repo.PostLogin(req,res);
        if(isValid){
            req.session.user_id=req.body['user_id'];
            return true;
        }
        else{
            throw new Error("Invalid Credential");
        }
    };
    async GetTodos(req, res){
        return await this.Repo.GetTodos(req,res);
    };
    async PostTodos(req, res){
        return await this.Repo.PostTodos(req,res);
    };
    async GetTodosById(req, res){
        return await this.Repo.GetTodosById(req,res);
    };
    async UpdateTodosById(req, res){
        return await this.Repo.UpdateTodosById(req,res);
    };
    async DeleteTodosById(req, res){
        return await this.Repo.DeleteTodosById(req,res);
    };
};
export function todosMiddleware(req, res, next){
    if(req.session.user_id){
        next();
    }
    else{
        res.redirect('/login');
    }
}