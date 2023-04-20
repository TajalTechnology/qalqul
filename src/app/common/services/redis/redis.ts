import * as redis from "redis";
import { REDIS_CONSTANTS } from "./redis.constants";

export class RedisService {
    port: number;
    host: string;
    client: any;

    constructor() {
        this.port = Number(process.env.REDIS_PORT) || 6379;
        this.host = process.env.REDIS_HOST || "127.0.0.1";
        this.setRedisClient();
    }

    private async setRedisClient(): Promise<void> {
        this.client = redis.createClient({
            url:
                `redis://${this.host}:${this.port}` || "redis://localhost:6379",
        });

        await this.client.connect();
        this.client.on("error", () => {
            throw new Error(REDIS_CONSTANTS.REDIS_CONNECTION_FAILED);
        });
    }

    async set(
        key: any,
        value: string,
        ex: string = REDIS_CONSTANTS.REDIS.MODE.EX,
        duration: number = REDIS_CONSTANTS.REDIS.MODE.REDIS_DURATION
    ) {
        return await this.client.set(key, value, ex, duration);
    }
    async getData(key: string): Promise<string | boolean | any> {
        if (key !== null && key !== undefined && key !== "undefined") {
            return await this.client.get(key);
        }
    }

    async delete(key: string | string[]) {
        if (key !== null && key !== undefined && key !== "undefined") {
            return await this.client.del(key);
        }
    }
}
