import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";

export default class Love extends Command {
  constructor () {
    super({
      name: 'love',
      description: 'Calculates a chance of love between you and some one (or something)',
      usage: ['<Target?:Text>'],
      category: 'Fun',
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    const author = message.author;
    const target = args.length ? args.join(' ') : author;
    const chance = Math.floor(Math.random() * 100) + 1;

    message.channel.send(`There's ${chance}% chance of 💕 between ${author} and ${target}`).catch(console.error);
  }
}