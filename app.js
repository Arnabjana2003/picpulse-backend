import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"

const app = express()
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
// app.use(cors({origin:"http://localhost:5173"}))
app.use(cors())

app.get("/",(req,res)=>{
    res.send("Server running")
})

import postRouter from "./routes/postRouter.js"
import userRouter from "./routes/userRouter.js"
import likeRouter from "./routes/likeRouter.js"
import friendRouter from "./routes/friendRouter.js"
import commentRouter from "./routes/commentRouter.js"
app.use("/api/v1/user",userRouter)
app.use("/api/v1/post",postRouter)
app.use("/api/v1/like",likeRouter)
app.use("/api/v1/friend",friendRouter)
app.use("/api/v1/comment",commentRouter)

export {app}