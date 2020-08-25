import Command from '../../base/classes/Command';
import { Client, Message, MessageEmbed } from "discord.js";

export default class Poll extends Command {
  constructor () {
    super({
      name: 'poll',
      description: 'Create reaction poll of up to 10 options',
      usage: ['<Topic>', '<Option[2-10]>'],
      category: 'Miscellaneous',
      guildOnly: true,
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    if (args.length < 3) {
      message.channel.send(`You have to provide a topic and at least 2 options to start a poll!`).catch(console.error);
      return;
    }

    if (args.length > 11) {
      message.channel.send('You do really like answers huh? The limit is 10 options per poll').catch(console.error);
      return;
    }

    message.delete();

    const icons = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    let options = '';
    for (let i = 1; i < args.length; i++) {
      options += `${icons[i - 1]} ${args[i]}\n`;
    }

    const embed = new MessageEmbed()
      .setColor('GREEN')
      .setAuthor(message.author.username, message.author.displayAvatarURL() ?? message.author.defaultAvatarURL)
      .setTitle(args[0].replace(/"/g, ''))
      .setDescription(options.replace(/"/g, ''));

    message.channel.send(embed).then(async msg => {
      for (let i = 1; i < args.length; i++) {
        await msg.react(icons[i - 1]);
      }
    }).catch(console.error);
  }
}