import { Client } from 'discord.js';
import Event from '../base/classes/Event';
import presenceUpdater from '../base/functions/presenceUpdater';
import GuildExtension from '../base/structures/Guild';

export default class extends Event {

  constructor () {
    super('guildDelete');
  }

  public async execute(client: Client, guild: GuildExtension) {
    const database = await guild.database;

    // Remove guild from database
    await database.delete();

    // Update presence
    presenceUpdater(client);
  }
}