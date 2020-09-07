import { Client, Guild, TextChannel, User } from 'discord.js';
import Event from '../base/classes/Event';
import { memberBanned } from '../base/functions/loggerMessages';
import GuildExtension from '../base/structures/Guild';

export default class extends Event {

  constructor () {
    super('guildBanAdd');
  }

  public async execute(client: Client, guild: Guild, user: User) {
    const server = guild as GuildExtension;
    const database = await server.database;

    // Log event
    const logChannel = guild.channels.cache.find(c => c.id === database.log.channel) as TextChannel;
    const hasEvent = database.log.events.find((e: string) => e === 'memberBanned');
    if (logChannel && hasEvent) logChannel.send(await memberBanned(guild, user)).catch(e => console.error(e));
  }
}