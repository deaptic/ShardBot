import { Client } from 'discord.js';

export default class Bot {

  public client: Client;

  constructor () {
    this.client = new Client();
  }

  public async init() {
    try {
      await this.client.login(process.env.DISCORD_API_TOKEN);
      console.log(`Client login as ${this.client.user?.tag}`);
    } catch (e) {
      console.error(e);
    }
  }
}

const client = new Bot();
client.init();