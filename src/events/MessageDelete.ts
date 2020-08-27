import { Client, Message } from 'discord.js';
import Event from '../base/classes/Event';
import { messageDelete } from '../base/functions/loggerMessages';
import GuildExtension from '../base/structures/Guild';

export default class MessageDeleteEvent extends Event {

  constructor () {
    super('messageDelete');
  }

  public async execute(client: Client, message: Message) {
    const guild = message.guild as GuildExtension;
    const database = await guild.database;

    // Log event
    const logChannel: any = guild.channels.cache.find(c => c.id === database.log.channel);
    const hasEvent = database.log.events.find((e: string) => e === 'messageDelete');
    if (message.partial) return;
    if (logChannel && hasEvent) logChannel.send(await messageDelete(message)).catch(console.error);
  }
}