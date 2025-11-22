import { config as dotenvConfig } from "dotenv";
dotenvConfig()

const _config = {
    MONGO_URL:process.env.MONGO_URL,
    JWT_SECRET:process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    REFRESH_TOKEN:process.env.REFRESH_TOKEN,
    EMAIL_USER:process.env.EMAIL_USER,
    RABBITMQ_URI:process.env.RABBITMQ_URI
}

export default Object.freeze(_config)