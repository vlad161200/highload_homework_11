import { Module, Global } from "@nestjs/common";
import Redis from "ioredis";

const redisProvider = {
  provide: "REDIS_CLIENT",
  useFactory: () => {
    return new Redis({
      // enableTLSForSentinelMode: true,
      sentinels: [
        { host: "sentinel", port: 23679 }, // Имя хоста контейнера Sentinel и порт
      ],
      name: "mymaster", // Имя мастера, как указано в конфигурации Sentinel
      role: 'slave'
    });
  },
};

@Global()
@Module({
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}
