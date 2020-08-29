import { Client, Collection, Message, Snowflake } from 'discord.js';
import Event from '../base/classes/Event';
import { messageDeleteBulk } from '../base/functions/loggerMessages';
import GuildExtension from '../base/structures/Guild';

export default class MessageDeleteBulkEvent extends Event {

  constructor () {
    super('messageDeleteBulk');
  }

  public async execute(client: Client, messages: Collection<Snowflake, Message>) {
    const guild = messages.first()?.guild as GuildExtension;
    const database = await guild.database;

    if (!guild) return;

    // Log event
    const logChannel: any = guild.channels.cache.find(c => c.id === database.log.channel);
    const hasEvent = database.log.events.find((e: string) => e === 'messageDeleteBulk');
    if (logChannel && hasEvent) logChannel.send(await messageDeleteBulk(messages)).catch(console.error);
  }
}