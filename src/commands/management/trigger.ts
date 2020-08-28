import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";
import GuildExtension from '../../base/structures/Guild';
import { triggerTypes } from '../../base/data/TriggerTypes.json';

export default class CustomCommand extends Command {
  constructor () {
    super({
      name: 'trigger',
      description: 'Create custom triggers for custom commands',
      usage: [
        '<add/remove> <Command:CommandName> <Type:TriggerType> <Trigger:Text>',
        '<list>'
      ],
      category: 'Management',
      aliases: ['tr'],
      userPermissions: ['ADMINISTRATOR'],
      guildOnly: true
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    const guild = message.guild as GuildExtension;
    const database = await guild.database;

    switch (args[0]) {
      case 'add':
        if (args.length < 4) {
          message.channel.send('You didn\'t provide enough arguments: CommandName, TriggerType and Trigger are needed').catch(console.error);
          return;
        }

        const isCommand = database.customCommands.find((cmd: any) => cmd.name === args[1]);
        if (!isCommand) {
          message.channel.send('Could not find that command').catch(console.error);
          return;
        }

        const isValidTrigger = triggerTypes.includes(args[2]);
        if (!isValidTrigger) {
          message.channel.send(`Invalid trigger type. Available trigger types: \`${triggerTypes.sort().join(', ')}\``).catch(console.error);
          return;
        }

        for await (const trigger of database.triggers) {
          if (trigger.command === args[1] && trigger.triggerType === args[2] && trigger.trigger === args[3]) {
            message.channel.send('Trigger already exists!').catch(console.error);
            return;
          }
        }

        if (database.triggers.length > 50) {
          message.channel.send('This guild already has maximum number of triggers!').catch(console.error);
          return;
        }

        const newTrigger = {
          command: args[1],
          triggerType: args[2],
          trigger: args.slice(3).join(' ')
        };

        database.triggers.push(newTrigger);
        await database.save();
        message.channel.send('Trigger has been added!').catch(console.error);
        break;

      case 'remove':
        if (args.length < 4) {
          message.channel.send('You didn\'t provide enough arguments: CommandName, TriggerType and Trigger are needed').catch(console.error);
          return;
        }

        for await (const trigger of database.triggers) {
          if (trigger.command === args[1] && trigger.triggerType === args[2] && trigger.trigger === args[3]) {
            database.triggers.pull(trigger);
            await database.save();
            message.channel.send('Trigger removed!').catch(console.error);
            return;
          }
        }

        message.channel.send('Could not find that trigger!').catch(console.error);
        break;

      case 'list':
        if (!database.triggers.length) {
          message.channel.send('Trigger list is empty!').catch(console.error);
          return;
        }

        let triggerString = '';
        for await (const trigger of database.triggers) {
          triggerString += `Command: ${trigger.command}, TriggerType: ${trigger.triggerType}, Trigger: ${trigger.trigger},\n`;
        }

        message.channel.send(`\`\`\`${triggerString}\`\`\``).catch(console.error);
        break;

      default:
        message.channel.send(`You didn\'t provide a correct parameter, try using \`add\` or \`remove\``).catch(console.error);
        break;
    }
  }
}