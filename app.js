import express from "express"

const app = express()
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.send("Server running")
})

export {app}