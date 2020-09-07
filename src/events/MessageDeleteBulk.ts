import { Client, Collection, Message, Snowflake, TextChannel } from 'discord.js';
import Event from '../base/classes/Event';
import { messageDeleteBulk } from '../base/functions/loggerMessages';
import GuildExtension from '../base/structures/Guild';

export default class extends Event {

  constructor () {
    super('messageDeleteBulk');
  }

  public async execute(client: Client, messages: Collection<Snowflake, Message>) {
    const guild = messages.first()?.guild as GuildExtension;
    const database = await guild.database;

    if (!guild) return;

    // Log event
    const logChannel = guild.channels.cache.find(c => c.id === database.log.channel) as TextChannel;
    const hasEvent = database.log.events.find((e: string) => e === 'messageDeleteBulk');
    if (logChannel && hasEvent) logChannel.send(await messageDeleteBulk(messages)).catch(e => console.error(e));
  }
}