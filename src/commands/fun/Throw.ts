import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";
import { throwables } from '../../base/data/Throwables.json';

export default class Throw extends Command {
  constructor () {
    super({
      name: 'throw',
      description: 'Throws random things to a specified target',
      usage: ['<?Target:Text>'],
      category: 'Fun',
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    const author = message.author;
    const target = args.length ? args.join(' ') : 'random person nearby';
    const index = Math.floor(Math.random() * throwables.length);
    const threw = throwables[index];

    message.channel.send(`**${author}** threw **${threw}** at **${target}**`).catch(e => console.error(e));
  }
}