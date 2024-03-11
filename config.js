import dotenv from 'dotenv'
dotenv.config({
    path: "./.env" 
})

const config = {
    databaseUrl: String(process.env.DB_URL),
    accessTokenSecret :  String(process.env.ACCESS_TOKEN_SECRET),
    accessTokenExpiry :  String(process.env.ACCESS_TOKEN_EXPIRY)
}

export default config