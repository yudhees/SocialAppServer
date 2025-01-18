import { Router } from "express";
import PostsController from "../controller/PostsController";
import { addUser, validateAuth } from "../Middleware/AuthMiddleware";

const router=Router()
const authRouter=Router()
const Posts=new PostsController()
authRouter.use(validateAuth)
authRouter.post('/uploadPosts',Posts.uploadPosts)
authRouter.post('/updateLike/:postId',Posts.updateLike)
authRouter.post('/addNewComment/:postId',Posts.addNewComment)
router.get('/getPosts',addUser,Posts.getPosts)
router.get('/getPost/:postId',Posts.getPostDetail)
router.get('/getComments/:postId',Posts.getComments)
router.use(authRouter)
export default router