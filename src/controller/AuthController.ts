import {Request,Response} from 'express'
import {checkSchema, ValidationError, validationResult} from 'express-validator'
import Users from '../Models/Users'
import Hash from '../utils/Hash'
import { Jwt } from '../utils/Jwt'
export default class AuthController{
    public async register(req:Request,res:Response):Promise<any>{
        try{
         await checkSchema({
            email:{isEmail:true,exists:true,errorMessage:'Invalid Email'},
            name:{exists:{errorMessage:'Username Field Required'}},
            password:{exists:{errorMessage:'Password Field Required'}},
         }).run(req)
         const errors:ValidationError[]= validationResult(req).array()
         if (errors.length){
            res.status(419).send(validationErrorMessage(errors))
         }
         const user= new Users().db
         const data=req.body
         const alreadyExistingUser=await user.where('email',data.email).first()
         if(alreadyExistingUser){
            return res.status(419).send(errorMessage('Email Already Exists'))  
         }
         data.password=Hash.make(data.password)
         const result=await user.insert(data)
         data.id=result[0]
         const token=Jwt.encode(JSON.stringify({...data,tokenCreatedAt:new Date()}))
         return res.send({success:true,message:'User Registered Successfully',userData:data,token:token})
        }catch(err){
            console.error(err)   
            return res.status(500).send({success:false,message:'SomeThing Went Wrong Please Try Again'})
        }
    }
    async login(req:Request,res:Response):Promise<any>{
        try {
            await checkSchema({
                email:{isEmail:true,exists:true,errorMessage:'Invalid Email'},
                password:{exists:{errorMessage:'Password Field Required'}},
             }).run(req)
             const errors:ValidationError[]= validationResult(req).array()
             if (errors.length){
                res.status(419).send(validationErrorMessage(errors))
             }
             const user= new Users().db
             const data=req.body
             const existingData=await user.where('email',data.email).first()
             if(!existingData)return res.status(419).send(errorMessage('User Not Found'))
             if(!Hash.compare(data.password,existingData.password))return res.status(419).send(errorMessage('Invalid Password'))
             const token=Jwt.encode(JSON.stringify({...existingData,tokenCreatedAt:new Date()}))
             return res.send({success:true,userData:existingData,token:token})
        } catch (error) {
            console.error(error)
            return res.status(500).send(errorMessage())
        }
    }
    async getUser(req:Request,res:Response):Promise<any>{
        try {
            const token=req.headers.authorization
            if (!token)return res.status(413).send(errorMessage('Tokken Missing'))
            const userData=Jwt.decode(token)
            if (!userData?.id)return res.status(413).send(errorMessage('Invalid Token'))
            const user=new Users().db
            const dbUserData=await user.where('id',userData.id).first(['name','id','email'])
            if(!dbUserData)return res.status(413).send(errorMessage('Unable To Find User'))
            return res.send({success:true,user:dbUserData})
        } catch (error) {
            console.error(error)
            return res.status(500).send(errorMessage())
        }
    }
    
}
