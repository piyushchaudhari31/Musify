import { config as dotenvConfig } from "dotenv";
dotenvConfig();

export default {
    RABBITMQ_URI: process.env.RABBITMQ_URI,
    RESEND_API_KEY: process.env.RESEND_API_KEY
};
