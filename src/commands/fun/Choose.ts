import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";

export default class extends Command {
  constructor () {
    super({
      name: 'choose',
      description: 'Chooses between given arguments',
      usage: ['<Options[...]:Text>'],
      category: 'Fun',
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    if (args.length < 2) {
      message.channel.send(`You didn't provide enough arguments, two is needed!`).catch(e => console.error(e));
      return;
    }

    const index = Math.floor(Math.random() * args.length);
    const chosen = args[index];

    message.reply(chosen).catch(e => console.error(e));
  }
}