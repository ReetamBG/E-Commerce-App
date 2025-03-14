import Redis from "ioredis"

const redis = new Redis(process.env.UPSTASH_REDIS_URI);

export default redis