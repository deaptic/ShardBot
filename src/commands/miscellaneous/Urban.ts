import Command from '../../base/classes/Command';
import { Client, Message, MessageEmbed } from "discord.js";
import Axios from 'axios';

export default class extends Command {
  constructor () {
    super({
      name: 'urban',
      description: 'Search from urban dictionary',
      category: 'Miscellaneous',
      botPermissions: ['EMBED_LINKS']
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    if (!args.length) {
      message.channel.send(`You didn't provide a query`).catch(e => console.error(e));
      return;
    }
    const query = args.join(' ');
    const response = await Axios.get(`http://api.urbandictionary.com/v0/define?term=${query}`);
    const firstResult = response.data.list[0];
    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle(query)
      .setURL(firstResult.permalink)
      .setDescription(firstResult.definition);

    message.channel.send(embed).catch(e => console.error(e));
  }
}