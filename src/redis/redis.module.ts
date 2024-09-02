import { Module, Global } from "@nestjs/common";
import { createCluster } from "redis";

const redisProvider = {
  provide: "REDIS_CLIENT",
  useFactory: async () => {
    const cluster = createCluster({
      rootNodes: [
        { url: "redis://redis_1:6379" },
        { url: "redis://redis_2:6379" },
        { url: "redis://redis_3:6379" },
        { url: "redis://redis_4:6379" },
        { url: "redis://redis_5:6379" },
        { url: "redis://redis_6:6379" },
      ],
      defaults: { socket: { connectTimeout: 50000 } },
    });
    await cluster.connect();
    console.log("REDIS is connected");
    return cluster;
  },
};

@Global()
@Module({
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}
