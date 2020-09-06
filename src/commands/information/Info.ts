import Command from '../../base/classes/Command';
import { Client, Message, MessageEmbed } from "discord.js";

export default class Info extends Command {
  constructor () {
    super({
      name: 'info',
      description: 'Responds with bot information',
      category: 'Information',
      botPermissions: ['EMBED_LINKS']
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setAuthor(client.user?.tag, client.user?.avatarURL() ?? client.user?.defaultAvatarURL)
      .setDescription(process.env.npm_package_description)
      .addField('Version', process.env.npm_package_version);

    message.channel.send(embed).catch(e => console.error(e));
  }
}