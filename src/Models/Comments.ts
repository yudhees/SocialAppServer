import BaseModel from "./BaseModel";

export interface Comment{
    id:number,
    post_id:number|string,
    user_id:number,
    likes?:number,
    comment?:string,
    created_at?:Date,
    updated_at?:Date,
}

export default class Comments extends BaseModel{
    constructor(){
        super('comments')
    }
}