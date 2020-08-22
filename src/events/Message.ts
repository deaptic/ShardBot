import { Client, Message, PermissionString } from 'discord.js';
import Event from '../base/classes/Event';
import { commands } from '../base/collections/commands';

export default class MessageEvent extends Event {

  constructor () {
    super('message');
  }

  public async execute(client: Client, message: Message) {
    const prefix = '.';
    if (message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).split(/ +/g);
      const commandName = args.shift()?.toLowerCase()!;
      const command: any = commands.get(commandName) || commands.find(cmd => cmd.aliases.includes(commandName));

      if (!command) return;

      if (!command.enabled) return;

      if (!command.userPermissions.every((permission: PermissionString) => message.member?.permissions.toArray().includes(permission))) {
        message.channel.send(`You don't have permissions to run this command!`).catch(console.error);
        return;
      }

      if (command.guildOnly && message.channel.type === 'dm') {
        message.channel.send(`Command you are trying to execute is only accessible on guild channel!`).catch(console.error);
        return;
      }

      try {
        command.execute(client, message, args);
      } catch (e) {
        console.error(e);
        message.channel.send(`There was an error trying to execute that command!`).catch(console.error);
      }
    }
  }
}