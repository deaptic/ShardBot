import Command from '../../base/classes/Command';
import { Client, Message, TextChannel } from "discord.js";

export default class extends Command {
  constructor () {
    super({
      name: 'clean',
      description: 'Deletes up to 100 messages from chat',
      usage: ['<Limit:Number> <?User:ID>'],
      category: 'Moderation',
      aliases: ['clear', 'cl', 'purge'],
      guildOnly: true,
      userPermissions: ['MANAGE_MESSAGES'],
      botPermissions: ['MANAGE_MESSAGES'],
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    if (!args.length) {
      message.channel.send(`You did not provide enough arguments`).catch(e => console.error(e));
      return;
    }

    let limit = parseInt(args[0]) || 0;

    if (limit < 1) return;
    if (limit > 100) limit = 100;

    const target = message.guild?.members.cache.find(member => member.id === args[1]);
    const channel = message.channel as TextChannel;
    if (!target) {
      channel.bulkDelete(limit).then(messages => {
        message.channel.send(`Deleted \`${messages.size}\` messages`).catch(e => console.error(e));
      }).catch(e => console.error(e));
      return;
    }

    channel.messages.fetch({ limit }).then(messages => {
      const userMessages = messages.filter(m => m.author.id === target.id);
      channel.bulkDelete(userMessages).then(() => {
        message.channel.send(`Deleted \`${userMessages.size}\` messages from ${target}`).catch(e => console.error(e));
      }).catch(e => console.error(e));
    });
  }
}