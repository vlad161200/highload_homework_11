import { Inject, Injectable } from "@nestjs/common";
import { RedisClientType } from "redis";

@Injectable()
export class UserService {
  constructor(
    @Inject("REDIS_CLIENT") private readonly redisClient: RedisClientType,
  ) {}

  async databaseMock(userId) {
    console.log("invoke database mock with userId:", userId);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: "Vladyslav",
          surname: "Kolomoiets",
          age: 23,
        });
      }, 1000);
    });
  }

  async getFromCache(key, callback, ttl, tte = 5) {
    const cache = await this.redisClient.get(key);
    const redisTtl = await this.redisClient.ttl(key);
    if (redisTtl < tte || redisTtl - tte < 5) {
      const recalculationBlock = await this.redisClient.get(
        `recalculation_${key}`,
      );
      if (!recalculationBlock || recalculationBlock === "false") {
        await this.redisClient.set(`recalculation_${key}`, "true", {
          EX: tte + 1,
        });
        callback()
          .then((data) => this.create(key, data, ttl))
          .finally(() => this.redisClient.set(`recalculation_${key}`, "false"));
      }
    }
    if (!cache) {
      const databaseResponse = callback();
      await this.create(key, ttl);
      console.log("value from db");
      return databaseResponse;
    } else {
      console.log("value from cache");
      return JSON.parse(cache);
    }
  }

  async get() {
    return this.getFromCache(
      "userId",
      () => this.databaseMock("userId"),
      10,
      2,
    );
  }

  async create(key = "userId", data, ttl?) {
    await this.redisClient.set(key as any, JSON.stringify(data), {
      EX: ttl,
    } as any);
  }
}
