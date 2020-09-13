import { Client, Message, TextChannel } from 'discord.js';
import Event from '../base/classes/Event';
import { messageDelete } from '../base/functions/loggerMessages';
import GuildExtension from '../base/structures/Guild';

export default class extends Event {

  constructor () {
    super('messageDelete');
  }

  public async execute(client: Client, message: Message) {
    const guild = message.guild as GuildExtension;
    const database = await guild.database;

    if (!message.guild) return;
    if (message.partial) return;
    if (message.content.startsWith(database.prefix)) return;
    if (message.author.bot) return;

    // Log event
    const logChannel = guild.channels.cache.find(c => c.id === database.log.channel) as TextChannel;
    const hasEvent = database.log.events.find((e: string) => e === 'messageDelete');
    if (logChannel && hasEvent) logChannel.send(await messageDelete(message)).catch(e => console.error(e));
  }
}