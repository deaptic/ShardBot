import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";
import GuildExtension from '../../base/structures/Guild';

export default class MemberJoin extends Command {
  constructor () {
    super({
      name: 'memberjoin',
      description: 'Set log channel for memberJoin event',
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
          database.log.memberJoin = message.channel.id;
          await database.save();
          message.channel.send('This channel has set for logging memberJoin event').catch(console.error);
          return;
        }

        const isChannel = message.guild?.channels.cache.find(channel => channel.id === args[1]);
        if (!isChannel) {
          message.channel.send('Could not find that channel!').catch(console.error);
          return;
        }

        database.log.memberJoin = isChannel.id;
        await database.save();
        message.channel.send(`${isChannel} channel has set for logging memberJoin event`).catch(console.error);
        break;

      case 'delete':
        database.log.memberJoin = undefined;
        await database.save();
        message.channel.send(`memberJoin event logging channel cleared`).catch(console.error);
        break;

      default:
        message.channel.send(`You didn\'t provide a correct parameter, try using \`set\` or \`delete\``).catch(console.error);
        break;
    }
  }
}