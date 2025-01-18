import { ValidationError } from "express-validator";
import 'express-session'
import { User } from "./src/Models/Users";
declare global {
    type errorResposne={success:boolean,message:string|any}
    function validationErrorMessage(errors: ValidationError[]):errorResposne;
    function errorMessage(message?:string|any,success?:boolean,):errorResposne
    function env(key:string,defult?:any):any
}

declare module "express" {
    interface Request{
      user?:User|null
    }
}
export { };

