import { Client, Message } from 'discord.js';
import Event from '../base/classes/Event';
import { messageUpdate } from '../base/functions/loggerMessages';
import GuildExtension from '../base/structures/Guild';

export default class MessageUpdateEvent extends Event {

  constructor () {
    super('messageUpdate');
  }

  public async execute(client: Client, oldMessage: Message, newMessage: Message) {
    const guild = oldMessage.guild as GuildExtension;
    const database = await guild.database;

    // Log event
    const logChannel: any = guild.channels.cache.find(c => c.id === database.log.channel);
    const hasEvent = database.log.events.find((e: string) => e === 'messageUpdate');
    if (logChannel && hasEvent) logChannel.send(await messageUpdate(oldMessage, newMessage)).catch(console.error);
  }
}