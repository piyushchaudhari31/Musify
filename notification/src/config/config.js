import { config as dotenvConfig } from "dotenv";
dotenvConfig()

const _config = {
    RESEND_API_KEY:process.env.RESEND_API_KEY,
    RABBITMQ_URI: process.env.RABBITMQ_URI
}

export default Object.freeze(_config)