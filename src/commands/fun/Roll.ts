import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";

export default class Roll extends Command {
  constructor () {
    super({
      name: 'roll',
      description: 'Roll a die',
      usage: ['<?Sides:Number>'],
      category: 'Fun',
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    let sides = parseInt(args[0]);
    if (!sides) sides = 6;
    const roll = Math.floor(Math.random() * sides) + 1;

    message.channel.send(`🎲 ${roll} (1 - ${sides})`).catch(e => console.error(e.message));
  }
}