import { Client, GuildMember } from 'discord.js';
import Event from '../base/classes/Event';
import autoRole from '../base/functions/autoRole';
import memberJoin from '../base/functions/memberJoin';
import GuildExtension from '../base/structures/Guild';

export default class ReadyEvent extends Event {

  constructor () {
    super('guildMemberAdd');
  }

  public async execute(client: Client, member: GuildMember) {
    const guild = member.guild as GuildExtension;
    const database = await guild.database;

    // Log event
    const logChannel: any = member.guild.channels.cache.find(c => c.id === database.log.channel);
    const hasEvent = database.log.events.find((e: string) => e === 'memberJoin');
    if (logChannel && hasEvent) logChannel.send(await memberJoin(member)).catch(console.error);

    // Assign role to a new member
    autoRole(member);
  }
}