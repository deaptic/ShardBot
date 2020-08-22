import { Client } from 'discord.js';
import Event from '../base/classes/Event';

export default class ReadyEvent extends Event {

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
  }
}