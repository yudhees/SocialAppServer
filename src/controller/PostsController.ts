import { Request,Response } from "express";
import Posts from "../Models/Posts";
import knexConfig from "../config/database";
import Likes, { Like } from "../Models/Likes";
import Comments from "../Models/Comments";
import moment from "moment";

export default class PostsController{
    public async uploadPosts(req:Request,res:Response):Promise<any>{
        const {body,user}=req
        try {
            const posts=new Posts().db
            body.user_id=user.id
            await posts.insert(body)
            return res.send({status:true,message:'Post Created Successfully'})            
        } catch (error) {
            return res.status(500).send(errorMessage())
        }
    }
    public async getPosts(req:Request,res:Response):Promise<any>{
        try {
            const {body,user}=req
            const userId=user?.id
            const query=new Posts().db
            query
            .select(
              'posts.*',
              'users.name as postedBy',
              knexConfig.raw('COUNT(DISTINCT CASE WHEN total_likes.isLiked = 1 THEN total_likes.id ELSE NULL END) as totalLikes')
            )
            .innerJoin('users', 'posts.user_id', 'users.id')
            .leftJoin({ total_likes: 'likes' }, 'posts.id', 'total_likes.post_id')
            if(userId){
             query
             .select('user_likes.isLiked')
             .leftJoin(
                { user_likes: 'likes' },
                function () {
                  this.on('posts.id', '=', 'user_likes.post_id')
                  .andOn('user_likes.user_id', '=', userId); 
                }
              )
            } 
            query.groupBy('posts.id', 'users.id');
            const data=await query.orderBy('created_at','desc').then()
            return res.send({status:true,data})      
        } catch (error) {
            console.error(error)
            return res.status(500).send(errorMessage())
        }
    }
    public async updateLike(req:Request,res:Response):Promise<any>{
        try {
            const {postId}=req.params
            const user=req.user
            const postQuery=new Posts().db
            const post=await postQuery.where('id',postId).first()
            if(!post)return res.status(414).send(errorMessage('Invalid Post'))
            const likes=new Likes().db
            const userLikes:Like|null=await likes.where('post_id',postId).where('user_id',user.id).first()
            let isLiked=userLikes?Number(!userLikes.isLiked):1
            const data={
                isLiked,updated_at:new Date(),post_id:postId,user_id:user.id
            }
            if( userLikes){
                await likes.where('post_id',postId).where('user_id',user.id).update('isLiked',isLiked)
            }else
               await likes.insert(data)
            return res.send({success:true,message:'Like Updated'})
        } catch (error) {
            console.error(error)
            return res.status(500).send(errorMessage())
        }
    }
    public async getPostDetail(req:Request,res:Response):Promise<any>{
        try {
            const {postId}=req.params
            const postQuery=new Posts().db
            const post=await postQuery.where('id',postId).first()
            if(!post)return res.status(414).send(errorMessage('Invalid Post'))
            const data={post}
            return res.send({success:true,data})
        } catch (error) {
            console.error(error)
            return res.status(500).send(errorMessage())
        }
    }
    public async getComments(req:Request,res:Response):Promise<any>{
        try {
            const {postId}=req.params
            const commentQuery=new Comments().db
            const comments=await commentQuery
            .select('comments.*','users.name as userName')
            .where('post_id',postId)
            .innerJoin('users','comments.user_id','=','users.id').orderBy('created_at','desc').then()
            const results=comments.map(comment=>{
                return {...comment,created_at:moment(res.created_at).format('MM-DD-YYYY hh:mm')}
            })
            return res.send({success:true,data:results})
        } catch (error) {
            console.error(error)
            return res.status(500).send(errorMessage())
        }
    }
    public async addNewComment(req:Request,res:Response):Promise<any>{
        try {
            const {user}=req
            const {comment}=req.body
            const {postId}=req.params
            const postQuery=new Posts().db
            const post=await postQuery.where('id',postId).first()
            if(!post)return res.status(414).send(errorMessage('Invalid Post'))
            const commentQuery=new Comments().db
            const data={comment,user_id:user.id,post_id:post.id}
            await commentQuery.insert(data)
            return res.send({success:true,message:'Comment Added Successfully'})
        } catch (error) {
            console.error(error)
            return res.status(500).send(errorMessage())
        }
    }
}