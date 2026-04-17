import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

// Connect to Redis
if (process.env.NODE_ENV !== 'test') {
    redisClient.connect().catch(console.error);
}

export { redisClient };

// Cache utilities
export async function cacheGet(key: string) {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Cache get error:', error);
        return null;
    }
}

export async function cacheSet(
    key: string,
    value: any,
    expirationSeconds = 3600
) {
    try {
        await redisClient.setEx(
            key,
            expirationSeconds,
            JSON.stringify(value)
        );
    } catch (error) {
        console.error('Cache set error:', error);
    }
}

export async function cacheDel(key: string) {
    try {
        await redisClient.del(key);
    } catch (error) {
        console.error('Cache delete error:', error);
    }
}
