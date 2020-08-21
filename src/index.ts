import { ShardingManager } from 'discord.js';
import path from "path";
import dotenv from 'dotenv';
dotenv.config();

const manager = new ShardingManager(path.join(__dirname, './client.js'), { token: process.env.DISCORD_API_TOKEN });

manager.spawn();
manager.on('shardCreate', shard => {
  console.log(`Launched shard ${shard.id}`);
});