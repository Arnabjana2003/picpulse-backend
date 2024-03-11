import dotenv from 'dotenv'
dotenv.config({
    path: "./.env" 
})

const config = {
    databaseUrl: String(process.env.DB_URL),
}

export default config