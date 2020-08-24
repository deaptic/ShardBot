import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";
import GuildExtension from '../../base/structures/Guild';

export default class MemberLeft extends Command {
  constructor () {
    super({
      name: 'memberleft',
      description: 'Set log channel for memberLeft event',
      usage: ['parameter:set|delete', 'channel:id'],
      category: 'Moderation',
      userPermissions: ['ADMINISTRATOR'],
      guildOnly: true
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    const guild = message.guild as GuildExtension;
    const database = await guild.database;

    switch (args[0]) {
      case 'set':
        if (!args[1]) {
          database.log.memberLeft = message.channel.id;
          await database.save();
          message.channel.send('This channel has set for logging memberLeft event').catch(console.error);
          return;
        }

        const isChannel = message.guild?.channels.cache.find(channel => channel.id === args[1]);
        if (!isChannel) {
          message.channel.send('Could not find that channel!').catch(console.error);
          return;
        }

        database.log.memberLeft = isChannel.id;
        await database.save();
        message.channel.send(`${isChannel} channel has set for logging memberLeft event`).catch(console.error);
        break;

      case 'delete':
        database.log.memberLeft = undefined;
        await database.save();
        message.channel.send(`memberLeft event logging channel cleared`).catch(console.error);
        break;

      default:
        message.channel.send(`You didn\'t provide a correct parameter, try using \`set\` or \`delete\``).catch(console.error);
        break;
    }
  }
}