import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";
import GuildExtension from '../../base/structures/Guild';
import autoRole from '../../base/functions/autoRole';

export default class extends Command {
  constructor () {
    super({
      name: 'autorole',
      description: 'Set automatically assigned role',
      usage: ['<set/delete> <Role:ID>'],
      category: 'Management',
      guildOnly: true,
      userPermissions: ['MANAGE_ROLES'],
      botPermissions: ['MANAGE_ROLES'],
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    const guild = message.guild as GuildExtension;
    const database = await guild.database;

    switch (args[0]) {
      case 'set':
        if (!args[1]) {
          message.channel.send(`Please provide a valid role id`).catch(e => console.error(e));
          return;
        }

        const isRole = message.guild?.roles.cache.find(role => role.id === args[1]);
        if (!isRole) {
          message.channel.send('Could not find that role!').catch(e => console.error(e));
          return;
        }

        database.autoRole = isRole.id;
        await database.save();
        message.channel.send(`AutoRole has been added`).catch(e => console.error(e));

        message.guild?.members.cache.forEach(member => {
          autoRole(member);
        });
        break;

      case 'delete':
        database.autoRole = undefined;
        await database.save();
        message.channel.send(`AutoRole has been cleared`).catch(e => console.error(e));
        break;

      default:
        message.channel.send(`You didn\'t provide a correct parameter, try using \`set\` or \`delete\``).catch(e => console.error(e));
        break;
    }
  }
}