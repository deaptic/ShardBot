import { Client, GuildMember } from 'discord.js';
import Event from '../base/classes/Event';
import autoRole from '../base/functions/autoRole';

export default class ReadyEvent extends Event {

  constructor () {
    super('guildMemberAdd');
  }

  public async execute(client: Client, member: GuildMember) {
    // Assign role to a new member
    autoRole(member);
  }
}