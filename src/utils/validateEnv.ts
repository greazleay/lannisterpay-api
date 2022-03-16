import { cleanEnv, str } from "envalid";
import { config } from "dotenv";

config();

export const ENV = cleanEnv(process.env, {
    DB_URL: str(),
});