import Command from '../../base/classes/Command';
import { Client, Message, MessageEmbed } from "discord.js";

export default class Poll extends Command {
  constructor () {
    super({
      name: 'poll',
      description: 'Create reaction poll of up to 10 options',
      usage: ['<Topic:Text> <?Option[1-10]:Text>'],
      category: 'Miscellaneous',
      guildOnly: true,
      botPermissions: ['EMBED_LINKS', 'ADD_REACTIONS'],
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    if (!args.length) {
      message.channel.send(`You have to provide a topic to start a poll!`).catch(e => console.error(e));
      return;
    }

    if (args.length < 2) {
      const embed = new MessageEmbed()
        .setColor('YELLOW')
        .setAuthor(`${message.author.username} started a simple poll! 📊`, message.author.displayAvatarURL() ?? message.author.defaultAvatarURL)
        .setTitle(args[0].replace(/"/g, ''));

      if (message.deletable) message.delete().catch(e => console.error(e));
      message.channel.send(embed).then(async msg => {
        await msg.react('👍');
        await msg.react('👎');
      }).catch(e => console.error(e));
      return;
    }


    if (args.length > 11) {
      message.channel.send('You do really like answers, huh? The limit is ten options per a poll').catch(e => console.error(e));
      return;
    }

    const icons = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    let options = '';
    for (let i = 1; i < args.length; i++) {
      options += `${icons[i - 1]} ${args[i]}\n`;
    }

    const embed = new MessageEmbed()
      .setColor('GREEN')
      .setAuthor(`${message.author.username} started an advanced poll! 📊`, message.author.displayAvatarURL() ?? message.author.defaultAvatarURL)
      .setTitle(args[0].replace(/"/g, ''))
      .setDescription(options.replace(/"/g, ''));

    if (message.deletable) message.delete().catch(e => console.error(e));
    message.channel.send(embed).then(async msg => {
      for (let i = 1; i < args.length; i++) {
        await msg.react(icons[i - 1]);
      }
    }).catch(e => console.error(e));
  }
}