import BaseModel from "./BaseModel";

export interface Like{
    id:number|string,
    post_id:string|number,
    user_id:string|number,
    isLiked:number,
    created_at?:Date,
    updated_at?:Date,
}

export default class Likes extends BaseModel{
    constructor(){
        super('likes')
    }
}