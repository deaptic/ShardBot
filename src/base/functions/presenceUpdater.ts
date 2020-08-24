import { Client } from 'discord.js';

export default async function presenceUpdater(client: Client) {
  const guilds = await client.shard?.fetchClientValues('guilds.cache.size');
  const guildCount = await guilds?.reduce((acc, count) => acc + count, 0);

  client.user?.setPresence({
    activity: {
      name: `${guildCount} servers!`,
      type: 'WATCHING',
    }
  });
}