import Command from '../../base/classes/Command';
import { Client, Message, MessageEmbed } from "discord.js";
import { commands } from '../../base/collections/commands';
import GuildExtension from '../../base/structures/Guild';

export default class Help extends Command {
  constructor () {
    super({
      name: 'help',
      description: 'Shows help about all or one specific command',
      usage: ['<?Command:Text>'],
      category: 'Information',
      botPermissions: ['EMBED_LINKS']
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    const guild = message.guild as GuildExtension;
    const database = await guild.database;

    if (!args.length) {
      const categories = new Set();
      commands.forEach(cmd => {
        categories.add(cmd.category);
      });

      const embed = new MessageEmbed()
        .setColor('BLUE')
        .setAuthor('Help', client.user?.avatarURL() || client.user?.defaultAvatarURL)
        .setDescription(
          `Minimalist and secure multipurpose discord bot
          To get a more detailed description of a command use \`${database.prefix}help <command>\`
          
          **Need help? [Support](https://discord.gg/mHa6W86 'Link to Shardie's support server')**`
        )
        .addField('\u200B', '\u200B');

      for await (const category of categories) {
        const cmds: string[] = [];
        commands.forEach(cmd => {
          if (cmd.category === category) {
            cmds.push(`\`${cmd.name}\``);
          }
        });

        embed.addField(category, cmds.sort().join(' '));
      }

      message.channel.send(embed).catch(e => console.error(e));
      return;
    }

    const commandName = args[0];
    const command = commands.get(commandName) || commands.find(cmd => cmd.aliases.includes(commandName));

    if (!command) {
      message.channel.send('Could not find that command!').catch(e => console.error(e));
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

    let aliases = '';
    if (command.aliases.length) {
      aliases = `(${command.aliases.sort().join('/')})`;
    }

    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle(`${command.name} ${aliases}`)
      .setDescription(command.description)
      .addField('Usage', `\`\`\`${usages}\`\`\``);

    message.channel.send(embed).catch(e => console.error(e));
  }
}