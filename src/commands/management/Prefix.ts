import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";
import GuildExtension from '../../base/structures/Guild';

export default class Prefix extends Command {
  constructor () {
    super({
      name: 'prefix',
      description: 'Show and manage guild prefix',
      usage: ['<Prefix?:Text>'],
      category: 'Management',
      guildOnly: true,
      userPermissions: ['ADMINISTRATOR'],
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    const guild = message.guild as GuildExtension;
    const database = await guild.database;

    if (!args.length) {
      message.channel.send(`Guild prefix is currently \`${database.prefix}\``).catch(e => console.error(e.message));
      return;
    }

    if (args[0].length > 3) {
      message.channel.send(`Prefix can be only up to 3 characters`).catch(e => console.error(e.message));
      return;
    }

    database.prefix = args[0];
    await database.save();
    message.channel.send(`Guild prefix has changed to \`${database.prefix}\``).catch(e => console.error(e.message));
  }
}