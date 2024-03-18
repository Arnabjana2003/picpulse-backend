import {mongoose} from "mongoose"
import config from "../config.js"

const dbConnect = async ()=>{
    try {
        await mongoose.connect(`${config.databaseUrl}/picpulse`)
        console.log("Database connected to ",config.databaseUrl)
    } catch (error) {
        console.log("DATABASE CONNECTION ERROR::",error)
        throw error
    }
}

export default dbConnect