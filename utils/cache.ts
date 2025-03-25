import NodeCache from "node-cache";

class ServerCache {
	private static instance: ServerCache;
	private cache: NodeCache;

	private constructor() {
		this.cache = new NodeCache({
			stdTTL: 0,
			checkperiod: 150,
		});
	}

	public static getInstance(): ServerCache {
		if (!ServerCache.instance) {
			ServerCache.instance = new ServerCache();
		}
		return ServerCache.instance;
	}

	public set<T>(key: string, value: T, ttl: number = 300): boolean {
		return this.cache.set(key, value, ttl);
	}

	public get<T>(key: string): T | undefined {
		return this.cache.get<T>(key);
	}

	public delete(key: string): number {
		return this.cache.del(key);
	}

	public has(key: string): boolean {
		return this.cache.has(key);
	}

	public clear(): void {
		this.cache.flushAll();
	}

	public keys(): string[] {
		return this.cache.keys();
	}
}

export const serverCache = ServerCache.getInstance();

export default ServerCache;
