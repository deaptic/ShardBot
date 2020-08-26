import { Client, Guild, User } from 'discord.js';
import Event from '../base/classes/Event';
import memberBanned from '../base/functions/memberBanned';
import GuildExtension from '../base/structures/Guild';

export default class GuildCreateEvent extends Event {

  constructor () {
    super('guildBanAdd');
  }

  public async execute(client: Client, guild: Guild, user: User) {
    const server = guild as GuildExtension;
    const database = await server.database;

    // Log event
    const logChannel: any = guild.channels.cache.find(c => c.id === database.log.channel);
    const hasEvent = database.log.events.find((e: string) => e === 'memberBanned');
    if (logChannel && hasEvent) logChannel.send(await memberBanned(user)).catch(console.error);
  }
}