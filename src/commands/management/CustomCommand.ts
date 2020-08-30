import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";
import GuildExtension from '../../base/structures/Guild';
import { commands } from '../../base/collections/commands';

export default class CustomCommand extends Command {
  constructor () {
    super({
      name: 'customcommand',
      description: 'Create custom commands',
      usage: [
        '<add/remove> <Command:Text> <Content:Text>',
        '<list>'
      ],
      category: 'Management',
      aliases: ['cc', 'command'],
      guildOnly: true,
      userPermissions: ['ADMINISTRATOR'],
      botPermissions: ['SEND_MESSAGES'],
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    const guild = message.guild as GuildExtension;
    const database = await guild.database;

    switch (args[0]) {
      case 'add':
        if (args.length < 3) {
          message.channel.send('You have to provide command name and some content to it!').catch(console.error);
          return;
        }

        const hasCommand = commands.has(args[1]) ||
          commands.find(cmd => cmd.aliases.includes(args[1])) ||
          database.customCommands.find((cmd: any) => cmd.name === args[1]);

        if (hasCommand) {
          message.channel.send('Command name already exists!').catch(console.error);
          return;
        }

        if (database.customCommands.length > 50) {
          message.channel.send('This guild already has maximum number of custom commands!').catch(console.error);
          return;
        }

        const newCommand = {
          name: args[1].toLowerCase(),
          content: args.slice(2).join(' ')
        };

        database.customCommands.push(newCommand);
        await database.save();
        message.channel.send(`\`${newCommand.name}\` command has been added!`).catch(console.error);
        break;

      case 'remove':
        if (!args[1]) {
          message.channel.send('You have to provide command name you want to remove!').catch(console.error);
          return;
        }

        const isCommand = database.customCommands.find((cmd: any) => cmd.name === args[1]);
        if (!isCommand) {
          message.channel.send('Could not find that command!').catch(console.error);
          return;
        }

        for await (const trigger of database.triggers) {
          if (trigger.command === isCommand.name) {
            database.triggers.pull(trigger);
          }
        }

        database.customCommands.pull(isCommand);
        await database.save();
        message.channel.send('Command has been removed!').catch(console.error);
        break;

      case 'list':
        if (!database.customCommands.length) {
          message.channel.send(`Custom commands list is empty`).catch(console.error);
          return;
        }

        let cmds: string[] = [];
        database.customCommands.forEach((cmd: any) => {
          cmds.push(cmd.name);
        });
        message.channel.send(`List of all custom commands\n\`\`\`${cmds.sort().join(', ')}\`\`\``).catch(console.error);
        break;

      default:
        message.channel.send(`You didn\'t provide a correct parameter, try using \`add\` or \`remove\``).catch(console.error);
        break;
    }
  }
}