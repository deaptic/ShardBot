import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";
import Axios from 'axios';

export default class Advice extends Command {
  constructor () {
    super({
      name: 'advice',
      description: 'Gives an advice',
      category: 'Fun',
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    const response = await Axios.get('https://api.adviceslip.com/advice');
    const advice = response.data.slip.advice;
    message.reply(advice);
  }
}