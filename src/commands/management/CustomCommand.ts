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
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    const guild = message.guild as GuildExtension;
    const database = await guild.database;

    switch (args[0]) {
      case 'add':
        if (args.length < 3) {
          message.channel.send('You have to provide command name and some content to it!').catch(e => console.error(e));
          return;
        }

        const hasCommand = commands.has(args[1]) ||
          commands.find(cmd => cmd.aliases.includes(args[1])) ||
          database.customCommands.find((cmd: any) => cmd.name === args[1]);

        if (hasCommand) {
          message.channel.send('Command name already exists!').catch(e => console.error(e));
          return;
        }

        if (database.customCommands.length > 50) {
          message.channel.send('This guild already has maximum number of custom commands!').catch(e => console.error(e));
          return;
        }

        const newCommand = {
          name: args[1],
          content: args.slice(2).join(' ')
        };

        database.customCommands.push(newCommand);
        await database.save();
        message.channel.send(`\`${newCommand.name}\` command has been added!`).catch(e => console.error(e));
        break;

      case 'remove':
        if (!args[1]) {
          message.channel.send('You have to provide command name you want to remove!').catch(e => console.error(e));
          return;
        }

        const isCommand = database.customCommands.find((cmd: any) => cmd.name === args[1]);
        if (!isCommand) {
          message.channel.send('Could not find that command!').catch(e => console.error(e));
          return;
        }

        database.customCommands.pull(isCommand);
        await database.save();
        message.channel.send('Command has been removed!').catch(e => console.error(e));
        break;

      case 'list':
        if (!database.customCommands.length) {
          message.channel.send(`Custom commands list is empty`).catch(e => console.error(e));
          return;
        }

        let cmds: string[] = [];
        database.customCommands.forEach((cmd: any) => {
          cmds.push(cmd.name);
        });
        message.channel.send(`List of all custom commands\n\`\`\`${cmds.sort().join(', ')}\`\`\``).catch(e => console.error(e));
        break;

      default:
        message.channel.send(`You didn\'t provide a correct parameter, try using \`add\` or \`remove\``).catch(e => console.error(e));
        break;
    }
  }
}