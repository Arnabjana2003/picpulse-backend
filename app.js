import cookieParser from "cookie-parser"
import express from "express"

const app = express()
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("Server running")
})

import postRouter from "./routes/postRouter.js"
import userRouter from "./routes/userRouter.js"
app.use("/api/v1/user",userRouter)
app.use("/api/v1/post",postRouter)

export {app}