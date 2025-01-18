import express,{Request,Response} from 'express';
import './autoload'
import cors from 'cors'
import Auth from './routes/Auth';
import Posts from './routes/Posts'
import CookieParser from 'cookie-parser'
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json())
app.use(CookieParser())
app.use(cors())
app.use('/api',Auth)
app.use('/api',Posts)
app.use('/',(req:Request,res:Response)=>{
    res.send("Express Server Started")
})
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});