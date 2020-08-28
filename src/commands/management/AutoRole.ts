import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";
import GuildExtension from '../../base/structures/Guild';
import autoRole from '../../base/functions/autoRole';

export default class AutoRole extends Command {
  constructor () {
    super({
      name: 'autorole',
      description: 'Set automatically assigned role',
      usage: ['<set/delete> <Role:ID>'],
      category: 'Management',
      userPermissions: ['MANAGE_ROLES'],
      guildOnly: true
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    const guild = message.guild as GuildExtension;
    const database = await guild.database;

    switch (args[0]) {
      case 'set':
        if (!args[1]) {
          message.channel.send(`Please provide a valid role id`).catch(console.error);
          return;
        }

        const isRole = message.guild?.roles.cache.find(role => role.id === args[1]);
        if (!isRole) {
          message.channel.send('Could not find that role!').catch(console.error);
          return;
        }

        database.autoRole = isRole.id;
        await database.save();
        message.channel.send(`AutoRole has been added`).catch(console.error);

        message.guild?.members.cache.forEach(member => {
          autoRole(member);
        });
        break;

      case 'delete':
        database.autoRole = undefined;
        await database.save();
        message.channel.send(`AutoRole has been cleared`).catch(console.error);
        break;

      default:
        message.channel.send(`You didn\'t provide a correct parameter, try using \`set\` or \`delete\``).catch(console.error);
        break;
    }
  }
}