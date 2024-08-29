import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class UserService {
  constructor(@Inject("REDIS_CLIENT") private readonly redisClient: Redis) {}

  async get() {
    return this.redisClient.get("userId");
  }

  async create() {
    await this.redisClient.set(
      "userId",
      JSON.stringify({ name: "Vladyslav", surname: "Kolomoiets", age: 23 }),
    );
  }
}
