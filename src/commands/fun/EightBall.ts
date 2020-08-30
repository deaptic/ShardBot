import Command from '../../base/classes/Command';
import { Client, Message, MessageEmbed } from "discord.js";
import { answers } from '../../base/data/EightBall.json';

export default class EightBall extends Command {
  constructor () {
    super({
      name: '8ball',
      description: 'Wisdom from legendary 8ball',
      usage: ['<Question?:Text>'],
      category: 'Fun',
      botPermissions: ['SEND_MESSAGES'],
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    const question = args.length ? args.join(' ') : 'What ever you wanted to ask.';
    const index = Math.floor(Math.random() * answers.length);
    const answer = answers[index];


    const embed = new MessageEmbed()
      .setColor('YELLOW')
      .setAuthor(`${message.author.username} is seeking advice 🎱`, message.author.displayAvatarURL() ?? message.author.defaultAvatarURL)
      .addField('Question', question)
      .addField('Wisdom', answer);

    if (message.deletable) message.delete().catch(console.error);
    message.channel.send(embed).catch(console.error);
  }
}