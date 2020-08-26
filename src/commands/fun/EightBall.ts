import Command from '../../base/classes/Command';
import { Client, Message, MessageEmbed } from "discord.js";
import { answers } from '../../base/data/EightBall.json';

export default class Roll extends Command {
  constructor () {
    super({
      name: '8ball',
      description: 'Wisdom from legendary 8ball',
      usage: ['<Question:Text>'],
      category: 'Fun',
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    if (!args.length) {
      message.channel.send('You did not provide a question').catch(console.error);
      return;
    }

    if (args.length === 1) args[0].replace(/"/g, '');

    const index = Math.floor(Math.random() * answers.length);
    const answer = answers[index];

    const question = args.join(' ');

    const embed = new MessageEmbed()
      .setColor('YELLOW')
      .setAuthor(message.author.username, message.author.displayAvatarURL() ?? message.author.defaultAvatarURL)
      .addField('Question', question, true)
      .addField('Wisdom', answer, true);

    message.channel.send(embed).catch(console.error);
  }
}