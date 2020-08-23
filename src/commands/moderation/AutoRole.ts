import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";
import GuildExtension from '../../base/structures/Guild';
import autoRole from '../../base/functions/autoRole';

export default class Prefix extends Command {
  constructor () {
    super({
      name: 'autorole',
      description: 'Check or set an automatically assigned role',
      usage: ['parameter:set|delete', 'role:id|name'],
      category: 'Moderation',
      userPermissions: ['ADMINISTRATOR']
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    const guild = message.guild as GuildExtension;
    const database = await guild.database;

    // No args
    if (!args.length) {
      if (!database.autoRole) {
        message.channel.send(`There is currently no autoRole on this guild`).catch(console.error);
        return;
      }

      const autoRole = message.guild?.roles.cache.find(role => role.id === database.autoRole);
      if (!autoRole) {
        message.channel.send(`There is autoRole set but not found on guild`).catch(console.error);
        return;
      }

      message.channel.send(`Current autoRole is \`${autoRole.name}\``);
      return;
    }


    // Set new autoRole
    const param = args[0];
    if (param === 'set') {
      if (!args[1]) {
        message.channel.send(`Please provide a role name or id you want to set to autoRole`).catch(console.error);
        return;
      }

      const isRole = message.guild?.roles.cache.find(r => r.name === args[1]) ??
        message.guild?.roles.cache.find(r => r.id === args[1]);

      if (isRole) {
        database.autoRole = isRole.id;
        await database.save();
        message.channel.send(`New autoRole set`).catch(console.error);

        message.guild?.members.cache.forEach(member => {
          autoRole(member);
        });

        return;
      }

      message.channel.send(`Could not find that role!`).catch(console.error);
      return;
    }

    // Delete autoRole
    if (param === 'delete') {
      database.autoRole = undefined;
      await database.save();
      message.channel.send(`AutoRole has been cleared`).catch(console.error);
      return;
    }

    message.channel.send(`You didn\'t provide a correct parameter, try using \`set\` or \`delete\``).catch(console.error);
    return;
  }
}