import BaseModel from "./BaseModel";

export interface User{
   id:number|string,
   name:string,
   email:string,
   password?:string,
   created_at?:Date,
   updated_at?:Date,
}
export default class Users extends BaseModel{
    constructor(){
        super('users')
    }
}