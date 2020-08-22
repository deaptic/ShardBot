import { Client } from 'discord.js';
import { lstatSync, readdirSync } from 'fs';
import path from 'path';
import { commands } from './base/collections/commands';
import * as mongoose from './base/database/mongoose';

import './base/structures/Guild';

export default class Bot {

  public client: Client;

  constructor () {
    this.client = new Client();
  }

  public async init() {
    this.registerFiles('./commands');
    this.registerFiles('./events');

    try {
      await this.client.login(process.env.DISCORD_API_TOKEN);
      console.log(`Client login as ${this.client.user?.tag}`);
      mongoose.init();
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
      } else {
        const importFile = await import(path.join(__dirname, directory, file));
        const instance = new importFile.default();

        if (instance.type) {
          this.client.on(instance.type, (...args) => instance.execute(this.client, ...args));
        } else {
          commands.set(instance.name, instance);
        }
      }
    }
  }
}

const client = new Bot();
client.init();