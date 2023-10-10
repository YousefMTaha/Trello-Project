import dotenv from "dotenv"
dotenv.config()
import express from "express";
import bootstrap from "./src/index.router.js";
const app = express();
const port = 3000;
app.use('/uploads',express.static('./src/uploads/cover'))
app.use('/uploads',express.static('./src/uploads/profile'))
bootstrap(app,express)
app.listen(port , ()=>{
    return console.log(`SERVER IS RUNNING ON PORT ....... ${port}`)
})
