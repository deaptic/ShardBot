import { Client, GuildMember } from 'discord.js';
import Event from '../base/classes/Event';
import memberLeft from '../base/functions/memberLeft';
import GuildExtension from '../base/structures/Guild';

export default class ReadyEvent extends Event {

  constructor () {
    super('guildMemberRemove');
  }

  public async execute(client: Client, member: GuildMember) {
    const guild = member.guild as GuildExtension;
    const database = await guild.database;

    // Log event
    const logChannel: any = member.guild.channels.cache.find(c => c.id === database.log.memberJoin);
    if (logChannel) logChannel.send(await memberLeft(member)).catch(console.error);
  }
}