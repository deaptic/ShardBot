import { Client, Guild } from 'discord.js';
import Event from '../base/classes/Event';
import presenceUpdater from '../base/functions/presenceUpdater';

export default class GuildCreateEvent extends Event {

  constructor () {
    super('guildCreate');
  }

  public async execute(client: Client, guild: Guild) {
    // Update presence
    presenceUpdater(client);
  }
}