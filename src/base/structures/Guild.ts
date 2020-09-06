import { Structures, Client, Guild } from 'discord.js';
import { guild } from '../database/schemas/guilds';

Structures.extend('Guild', Guild => {
  class GuildExtension extends Guild {

    public database: Promise<any>;

    constructor (client: Client, data: { unavailable: boolean, id: string, shardID: number; }) {
      super(client, data);
      this.database = this.getByID(data.id);
    }

    private getByID(id: string) {
      return new Promise((resolve, reject) => {
        guild.findById(id, async (err, res) => {
          if (err) return reject(err);
          if (!res) {
            res = new guild({ _id: id });
            await res.save();
          }
          resolve(res);
        });
      });
    }
  }

  return GuildExtension;
});

export default interface GuildExtension extends Guild {
  database: Promise<any>;
}