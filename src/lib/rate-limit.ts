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

interface AnonymousLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
    message?: string;
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

// Anonymous user tracking with persistent storage across 24 hours
class AnonymousRateLimiter {
    private cache: LRUCache<string, { count: number; firstUsedAt: number }>;
    private readonly MAX_ANALYSES = 3;
    private readonly RESET_PERIOD = 24 * 60 * 60 * 1000; // 24 hours

    constructor() {
        this.cache = new LRUCache({
            max: 10000, // Support 10k unique IPs
            ttl: this.RESET_PERIOD, // Auto-cleanup after 24 hours
        });
    }

    checkAnonymousUser(ipAddress: string): AnonymousLimitResult {
        const now = Date.now();
        const entry = this.cache.get(ipAddress);

        if (!entry) {
            // First analysis for this IP
            this.cache.set(ipAddress, {
                count: 1,
                firstUsedAt: now,
            });

            return {
                allowed: true,
                remaining: this.MAX_ANALYSES - 1,
                resetAt: now + this.RESET_PERIOD,
            };
        }

        const timeSinceFirst = now - entry.firstUsedAt;
        const resetAt = entry.firstUsedAt + this.RESET_PERIOD;

        // Check if reset period has passed
        if (timeSinceFirst > this.RESET_PERIOD) {
            // Reset the counter
            this.cache.set(ipAddress, {
                count: 1,
                firstUsedAt: now,
            });

            return {
                allowed: true,
                remaining: this.MAX_ANALYSES - 1,
                resetAt: now + this.RESET_PERIOD,
            };
        }

        // Check if limit exceeded
        if (entry.count >= this.MAX_ANALYSES) {
            const hoursUntilReset = Math.ceil((resetAt - now) / (60 * 60 * 1000));

            return {
                allowed: false,
                remaining: 0,
                resetAt,
                message: `You've used all ${this.MAX_ANALYSES} free analyses. Sign in to get 50 credits, or try again in ${hoursUntilReset} hours.`,
            };
        }

        // Increment counter
        entry.count += 1;
        this.cache.set(ipAddress, entry);

        return {
            allowed: true,
            remaining: this.MAX_ANALYSES - entry.count,
            resetAt,
        };
    }

    getAnonymousStatus(ipAddress: string): { remaining: number; resetAt: number | null } {
        const now = Date.now();
        const entry = this.cache.get(ipAddress);

        if (!entry) {
            return {
                remaining: this.MAX_ANALYSES,
                resetAt: null,
            };
        }

        const timeSinceFirst = now - entry.firstUsedAt;
        const resetAt = entry.firstUsedAt + this.RESET_PERIOD;

        // Check if reset period has passed
        if (timeSinceFirst > this.RESET_PERIOD) {
            return {
                remaining: this.MAX_ANALYSES,
                resetAt: null,
            };
        }

        return {
            remaining: Math.max(0, this.MAX_ANALYSES - entry.count),
            resetAt,
        };
    }

    reset(ipAddress: string): void {
        this.cache.delete(ipAddress);
    }
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

// Anonymous user rate limiter (24-hour window, 3 analyses max)
export const anonymousAnalysisLimit = new AnonymousRateLimiter();