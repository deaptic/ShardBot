import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";

export default class extends Command {
  constructor () {
    super({
      name: 'ping',
      description: 'Responds with API response time',
      category: 'Information',
      aliases: ['latency', 'lat'],
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    message.channel.send(`My ping is ${client.ws.ping}ms!`).catch(e => console.error(e));
  }
}