import Command from '../../base/classes/Command';
import { Client, Message, TextChannel } from "discord.js";

export default class Ban extends Command {
  constructor () {
    super({
      name: 'clean',
      description: 'Delete a specified number of messages from chat',
      usage: ['<Limit:Number>'],
      category: 'Moderation',
      userPermissions: ['MANAGE_MESSAGES'],
      guildOnly: true
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    if (!args.length) {
      message.channel.send(`You did not provide enough arguments`).catch(console.error);
      return;
    }

    let limit = parseInt(args[0]) || 0;

    if (limit > 100) limit = 100;

    const channel = message.channel as TextChannel;
    channel.bulkDelete(limit).then(messages => {
      message.channel.send(`Bulk deleted \`${limit}\` messages`).catch(console.error);
    }).catch(console.error);
  }
}