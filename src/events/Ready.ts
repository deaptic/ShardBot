import { Client } from 'discord.js';
import Event from '../base/classes/Event';
import autoRole from '../base/functions/autoRole';
import presenceUpdater from '../base/functions/presenceUpdater';

export default class extends Event {

  constructor () {
    super('ready');
  }

  public async execute(client: Client) {
    // Generate an Invitation Link
    try {
      const link = await client.generateInvite(8);
      console.log('Invite bot to your server by using link below:');
      console.log(link);
    }
    catch (e) {
      console.error(e);
    }

    // Assign autoRoles
    client.guilds.cache.forEach(guild => {
      if (!guild.me?.hasPermission('MANAGE_ROLES')) return;
      guild.members.cache.forEach(member => {
        autoRole(member);
      });
    });

    // Set presence
    presenceUpdater(client);
  }
}