import { Client, Message, TextChannel } from 'discord.js';
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

    if (!oldMessage.guild) return;

    // Log event
    const logChannel = guild.channels.cache.find(c => c.id === database.log.channel) as TextChannel;
    const hasEvent = database.log.events.find((e: string) => e === 'messageUpdate');
    if (oldMessage.partial) return;
    if (oldMessage.content === newMessage.content) return;
    if (logChannel && hasEvent) logChannel.send(await messageUpdate(oldMessage, newMessage)).catch(e => console.error(e));
  }
}