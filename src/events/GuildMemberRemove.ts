import { Client, GuildMember, TextChannel } from 'discord.js';
import Event from '../base/classes/Event';
import { memberLeft } from '../base/functions/loggerMessages';
import GuildExtension from '../base/structures/Guild';

export default class ReadyEvent extends Event {

  constructor () {
    super('guildMemberRemove');
  }

  public async execute(client: Client, member: GuildMember) {
    const guild = member.guild as GuildExtension;
    const database = await guild.database;

    // Log event
    const logChannel = member.guild.channels.cache.find(c => c.id === database.log.channel) as TextChannel;
    const hasEvent = database.log.events.find((e: string) => e === 'memberLeft');
    if (logChannel && hasEvent) logChannel.send(await memberLeft(member)).catch(e => console.error(e.message));
  }
}