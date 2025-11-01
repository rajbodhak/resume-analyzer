import { LRUCache } from 'lru-cache';

type Options = {
    uniqueTokenPerInterval?: number;
    interval?: number;
};

interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
}

export function rateLimit(options?: Options) {
    const tokenCache = new LRUCache({
        max: options?.uniqueTokenPerInterval || 500,
        ttl: options?.interval || 60000, // Default 1 minute
    });

    return {
        check: (limit: number, token: string): Promise<void> =>
            new Promise<void>((resolve, reject) => {
                const tokenCount = (tokenCache.get(token) as number[]) || [0];
                if (tokenCount[0] === 0) {
                    tokenCache.set(token, tokenCount);
                }
                tokenCount[0] += 1;

                const currentUsage = tokenCount[0];
                const isRateLimited = currentUsage >= limit;

                if (isRateLimited) {
                    reject(new Error('Rate limit exceeded'));
                } else {
                    resolve();
                }
            }),

        // method that returns detailed info
        checkWithInfo: (limit: number, token: string): RateLimitResult => {
            const tokenCount = (tokenCache.get(token) as number[]) || [0];
            if (tokenCount[0] === 0) {
                tokenCache.set(token, tokenCount);
            }
            tokenCount[0] += 1;

            const currentUsage = tokenCount[0];
            const remaining = Math.max(0, limit - currentUsage);
            const isRateLimited = currentUsage > limit;

            return {
                success: !isRateLimited,
                limit,
                remaining,
                reset: Date.now() + (options?.interval || 60000),
            };
        },

        // Check without incrementing (for display purposes)
        getStatus: (token: string, limit: number): RateLimitResult => {
            const tokenCount = (tokenCache.get(token) as number[]) || [0];
            const currentUsage = tokenCount[0];
            const remaining = Math.max(0, limit - currentUsage);

            return {
                success: currentUsage < limit,
                limit,
                remaining,
                reset: Date.now() + (options?.interval || 60000),
            };
        },
    };
}

// Different rate limiters for different use cases
export const analysisRateLimit = rateLimit({
    interval: 60 * 60 * 1000, // 1 hour
    uniqueTokenPerInterval: 500,
});

export const parseRateLimit = rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500,
});