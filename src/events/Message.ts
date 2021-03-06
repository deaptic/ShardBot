import { Client, Message } from 'discord.js';
import Event from '../base/classes/Event';
import { commands } from '../base/collections/commands';
import GuildExtension from '../base/structures/Guild';

export default class extends Event {

  constructor () {
    super('message');
  }

  public async execute(client: Client, message: Message) {
    const guild = message.guild as GuildExtension;
    const database = await guild.database;

    if (message.author.bot) return;

    for (const command of database.customCommands) {
      if (message.content.startsWith(command.name)) {
        message.channel.send(command.content).catch(e => console.error(e));
      }
    }

    if (message.content.startsWith(database.prefix)) {
      const args = message.content.slice(database.prefix.length).match(/".*?"|[^\s]+/g);
      if (!args) return;
      const commandName = args.shift()?.toLowerCase()!;
      const command = commands.get(commandName) || commands.find(cmd => cmd.aliases.includes(commandName));

      if (!command) return;

      if (!command.enabled) return;

      if (!message.guild?.me?.hasPermission('SEND_MESSAGES')) return;

      if (!command.userPermissions.every(permission => message.member?.permissions.toArray().includes(permission))) {
        message.channel.send(`You don't have enough permissions to run this command!\n> Permissions needed: \`${command.botPermissions.join(`\` \``)}\``).catch(e => console.error(e));
        return;
      }

      if (!command.botPermissions.every(permission => message.guild?.me?.permissions.toArray().includes(permission))) {
        message.channel.send(`Bot does not have enough permissions to run this command!\n> Permissions needed: \`${command.botPermissions.join(`\` \``)}\``).catch(e => console.error(e));
        return;
      }

      if (command.guildOnly && message.channel.type === 'dm') {
        message.channel.send(`Command you are trying to execute is only accessible on guild channel!`).catch(e => console.error(e));
        return;
      }

      if (!command.execute) {
        message.channel.send('Command does not have execute function. Might be a bot owner\'s mistake!');
        return;
      }

      try {
        command.execute(client, message, args);
      } catch (e) {
        console.error(e);
        message.channel.send(`There was an error trying to execute that command!`).catch(e => console.error(e));
      }
    }
  }
}