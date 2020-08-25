import Command from '../../base/classes/Command';
import { Client, Message, MessageEmbed } from "discord.js";
import { commands } from '../../base/collections/commands';

export default class Help extends Command {
  constructor () {
    super({
      name: 'help',
      description: 'Shows help about all or one specific command',
      usage: ['<Command>'],
      category: 'Miscellaneous',
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    if (!args.length) {
      const categories = new Set();
      commands.forEach(cmd => {
        categories.add(cmd.category);
      });

      const embed = new MessageEmbed()
        .setTitle('Commands');

      for await (const category of categories) {
        const cmds: string[] = [];
        commands.sort().forEach(cmd => {
          if (cmd.category === category) {
            cmds.push(`\`${cmd.name}\` - ${cmd.description}`);
          }
        });

        embed.addField(category, cmds.sort().join('\n'));
      }

      message.channel.send(embed).catch(console.error);
      return;
    }

    const commandName = args[0];
    const command = commands.get(commandName) || commands.find(cmd => cmd.aliases.includes(commandName));

    if (!command) {
      message.channel.send('Could not find that command!').catch(console.error);
      return;
    }

    let usages = '';
    if (command.usage.length) {
      for await (const usage of command.usage) {
        usages += `${command.name} ${usage}\n`;
      }
    } else {
      usages = command.name;
    }

    const embed = new MessageEmbed()
      .setTitle(command.name)
      .setDescription(command.description)
      .addField('Usage', `\`\`\`${usages}\`\`\``);

    message.channel.send(embed).catch(console.error);
  }
}