import { Client, Message } from 'discord.js';
import Event from '../base/classes/Event';
import { commands } from '../base/collections/commands';
import GuildExtension from '../base/structures/Guild';

export default class MessageEvent extends Event {

  constructor () {
    super('message');
  }

  public async execute(client: Client, message: Message) {
    const guild = message.guild as GuildExtension;
    const database = await guild.database;

    if (message.content.startsWith(database.prefix)) {
      const args = message.content.slice(database.prefix.length).match(/(["'])(?:(?=(\\?))\2.)*?\1|(?<=\s|^)(.*?)(?=\s|$)/g);
      if (!args) return;
      const commandName = args.shift()?.toLowerCase()!;
      const command = commands.get(commandName) || commands.find(cmd => cmd.aliases.includes(commandName));

      if (!command) return;

      if (!command.enabled) return;

      if (!command.userPermissions.every(permission => message.member?.permissions.toArray().includes(permission))) {
        message.channel.send(`You don't have permissions to run this command!`).catch(console.error);
        return;
      }

      if (command.guildOnly && message.channel.type === 'dm') {
        message.channel.send(`Command you are trying to execute is only accessible on guild channel!`).catch(console.error);
        return;
      }

      if (!command.execute) return;

      try {
        command.execute(client, message, args);
      } catch (e) {
        console.error(e);
        message.channel.send(`There was an error trying to execute that command!`).catch(console.error);
      }
    }
  }
}