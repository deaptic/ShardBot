import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";
import Axios from 'axios';

export default class extends Command {
  constructor () {
    super({
      name: 'pun',
      description: 'Jokes, jokes, jokes',
      category: 'Fun',
      aliases: ['dadjoke']
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    const response = await Axios.get('https://icanhazdadjoke.com', { headers: { 'Accept': 'application/json' } });
    const joke = response.data.joke;
    message.reply(joke);
  }
}