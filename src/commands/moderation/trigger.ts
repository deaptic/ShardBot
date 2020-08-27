import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";
import GuildExtension from '../../base/structures/Guild';

export default class Trigger extends Command {
  constructor () {
    super({
      name: 'trigger',
      description: 'Set and manage command triggers',
      usage: [
        '<set/delete> <Trigger:String> <Command:CommandName>',
        '<list>'
      ],
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
        if (args.length < 3) {
          message.channel.send(`You didn\'t provide enough parameters, Trigger and Command is needed`).catch(console.error);
          return;
        }

        const hasCommand = database.customCommands.find((command: any) => command.name === args[2]);
        if (!hasCommand) {
          message.channel.send(`Could not find that command`).catch(console.error);
          return;
        }

        const hasTrigger = hasCommand.triggers.find((trigger: any) => trigger === args[1]);
        if (hasTrigger) {
          message.channel.send(`Command already has that trigger`).catch(console.error);
          return;
        }

        hasCommand.triggers.push(args[1]);
        await database.save();
        message.channel.send(`Trigger has been added`).catch(console.error);
        break;

      case 'delete':
        if (args.length < 3) {
          message.channel.send(`You didn\'t provide enough parameters, Trigger and Command is needed`).catch(console.error);
          return;
        }

        const commandExist = database.customCommands.find((command: any) => command.name === args[2]);
        if (!commandExist) {
          message.channel.send(`Could not find that command`).catch(console.error);
          return;
        }

        const triggerExist = commandExist.triggers.find((trigger: any) => trigger === args[1]);
        if (!triggerExist) {
          message.channel.send(`Could not find that trigger`).catch(console.error);
          return;
        }

        commandExist.triggers.pull(triggerExist);
        if (!commandExist.triggers.length) commandExist.triggers = undefined;
        await database.save();
        message.channel.send(`Trigger has been removed`).catch(console.error);
        break;

      case 'list':
        message.channel.send(`Not yet implemented`).catch(console.error);
        break;

      default:
        message.channel.send(`You didn\'t provide a correct parameter, try using \`set\` or \`delete\``).catch(console.error);
        break;
    }
  }
}