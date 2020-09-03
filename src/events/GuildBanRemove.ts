import { Client, Guild, TextChannel, User } from 'discord.js';
import Event from '../base/classes/Event';
import { memberUnbanned } from '../base/functions/loggerMessages';
import GuildExtension from '../base/structures/Guild';

export default class GuildCreateEvent extends Event {

  constructor () {
    super('guildBanRemove');
  }

  public async execute(client: Client, guild: Guild, user: User) {
    const server = guild as GuildExtension;
    const database = await server.database;

    // Log event
    const logChannel = guild.channels.cache.find(c => c.id === database.log.channel) as TextChannel;
    const hasEvent = database.log.events.find((e: string) => e === 'memberUnbanned');
    if (logChannel && hasEvent) logChannel.send(await memberUnbanned(guild, user)).catch(e => console.error(e.message));
  }
}