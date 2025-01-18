import { ValidationError } from "express-validator";

global.validationErrorMessage=function(errors: ValidationError[]):errorResposne{
      return errorMessage(errors[0]?.msg||'Some Thing Went Wrong')
}
global.errorMessage=function(message:string|any="SomeThing Went Wrong Please Try Again",success:boolean=false):errorResposne{
      return {success,message}
}
global.env=function(key:string,def:any=null):any{
      return process.env?.[key]??def
}