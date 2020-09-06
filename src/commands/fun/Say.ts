import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";

export default class Say extends Command {
  constructor () {
    super({
      name: 'say',
      description: 'Says what you want it to say',
      usage: ['<Query:Text>'],
      category: 'Fun',
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    if (!args.length) return;

    if (message.deletable) message.delete().catch(e => console.error(e));
    const query = args.join(' ');

    message.channel.send(query).catch(e => console.error(e));
  }
}