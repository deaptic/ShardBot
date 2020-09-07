import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";
import Axios from 'axios';

export default class extends Command {
  constructor () {
    super({
      name: '8ball',
      description: 'Wisdom from legendary 8ball',
      usage: ['<?Question:Text>'],
      category: 'Fun',
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    if (!args.length) {
      message.channel.send(`You didn't provide a question!`).catch(e => console.error(e));
      return;
    }

    const author = message.author;
    const params = encodeURIComponent(args.join(' '));
    const response = await Axios.get(`https://8ball.delegator.com/magic/JSON/${params}`);
    const answer = response.data.magic.answer;

    message.channel.send(`> ${args.join(' ')}\n${author} ${answer}`).catch(e => console.error(e));
  }
}