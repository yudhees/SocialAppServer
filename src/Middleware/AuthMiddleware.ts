import { NextFunction, Request, Response } from "express";
import { Jwt } from "../utils/Jwt";
import Users, { User } from "../Models/Users";

export const validateAuth=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    const token=req.headers.authorization
    if (!token)return res.status(413).send(errorMessage('Tokken Missing'))
    const userData=Jwt.decode(token)
    if (!userData?.id)return res.status(413).send(errorMessage('Invalid Token'))
    const user=new Users().db
    const dbUserData:User=await user.where('id',userData.id).first(['name','id','email'])
    if(!dbUserData)return res.status(413).send(errorMessage('Unable To Find User'))
    req.user=dbUserData
    next()
}

export const addUser=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    const token=req.headers.authorization
    let user=null
    if(token){
        const userData=Jwt.decode(token)
        if(userData?.id){
            const userQuery=new Users().db
            const dbUserData:User=await userQuery.where('id',userData.id).first(['name','id','email'])
            user=dbUserData
        }
    }
    req.user=user
    next()
}