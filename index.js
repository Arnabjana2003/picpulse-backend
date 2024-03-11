import { app } from './app.js'
import dbConnect from './database/index.js'

dbConnect()
.then(()=>{
    app.listen(8000,()=>console.log("Server started at the post 8000"))
})
.catch(error=>{
    console.error(error)
})