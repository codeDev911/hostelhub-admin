import Redis from 'ioredis';

// 1. Get the URL
const redisUrl = process.env.REDIS_URL;

if (!redisUrl) throw new Error("REDIS_URL is missing");

// 2. The Singleton for Next.js (Prevents connection limit errors)
const globalForRedis = global as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ||
  new Redis(redisUrl, {
    connectTimeout: 10000,
    lazyConnect: true, // Crucial for serverless
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

export const initializeHostelUsage = async (hostelId: string) => {
  const key = `usg:${hostelId}`;

  // Set all counters to 0 in one atomic operation
  await redis.hset(key, {
    us: 0, // usersCount
    rm: 0, //rooms count
    in: 0, //invoices
    py: 0, //payments
    im: 0, //  images
    ex: 0, // expenses
    bk: 0, // booking
  });

  // Optional: Set an expiration if the hostel is inactive for 30 days
  // to save  space
  await redis.expire(key, 60 * 60 * 24 * 30);
};
