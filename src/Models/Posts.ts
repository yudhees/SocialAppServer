import BaseModel from "./BaseModel";

export interface Post{
    id:number,
    heading:string,
    content:string,
    user_id:number,
    likes?:number,
    created_at?:Date,
    updated_at?:Date,
}

export default class Posts extends BaseModel{
    constructor(){
        super('posts')
    }
}