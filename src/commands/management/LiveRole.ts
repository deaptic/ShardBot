import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";
import GuildExtension from '../../base/structures/Guild';
export default class extends Command {
  constructor () {
    super({
      name: 'liverole',
      description: 'Set automatically assigned temporary role for streamers',
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
          message.channel.send(`Please provide a role id you want to set to liveRole`).catch(e => console.error(e));
          return;
        }

        const isRole = message.guild?.roles.cache.find(role => role.id === args[1]);
        if (!isRole) {
          message.channel.send('Could not find that role!').catch(e => console.error(e));
          return;
        }

        database.liveRole = isRole.id;
        await database.save();
        message.channel.send(`New liveRole set`).catch(e => console.error(e));
        break;

      case 'delete':
        database.liveRole = undefined;
        await database.save();
        message.channel.send(`LiveRole has been cleared`).catch(e => console.error(e));
        break;

      default:
        message.channel.send(`You didn\'t provide a correct parameter, try using \`set\` or \`delete\``).catch(e => console.error(e));
        break;
    }
  }
}