import { Client, Collection } from 'discord.js';
import { lstatSync, readdirSync } from 'fs';
import path from 'path';

export default class Bot {

  public client: Client;
  public commands: Collection<string, unknown>;

  constructor () {
    this.client = new Client();
    this.commands = new Collection();
  }

  public async init() {
    this.registerFiles('./commands');
    this.registerFiles('./events');

    try {
      await this.client.login(process.env.DISCORD_API_TOKEN);
      console.log(`Client login as ${this.client.user?.tag}`);
    } catch (e) {
      console.error(e);
    }
  }

  private async registerFiles(directory: string) {
    const files = readdirSync(path.join(__dirname, directory));
    for await (const file of files) {
      const stat = lstatSync(path.join(__dirname, directory, file));
      if (stat.isDirectory()) {
        this.registerFiles(path.join(directory, file));
        return;
      } else {
        const importFile = await import(path.join(__dirname, directory, file));
        const instance = new importFile.default(this.client);

        if (instance.type) {
          this.client.on(instance.type, (...args) => instance.execute(...args));
        } else {
          this.commands.set(instance.name, instance);
        }
      }
    }
  }
}

const client = new Bot();
client.init();