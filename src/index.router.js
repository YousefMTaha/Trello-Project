import connectDB from '../DB/connection.js'
import userRouter from './module/user/user.router.js'
import taskRouter from './module/task/task.router.js'
import { globalErrorHandler } from './utils/errorHandling.js'

const bootstrap = (app ,express)=>{
app.use(express.json())
app.use("/user",userRouter)
app.use("/task",taskRouter)
app.get("*",(req,res,next)=>{
    return res.json({message:"error 404"})
})
app.use(globalErrorHandler)
connectDB()
}
export default bootstrap