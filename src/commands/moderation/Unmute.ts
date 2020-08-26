import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";

export default class Unmute extends Command {
  constructor () {
    super({
      name: 'unmute',
      description: 'Unmutes a member',
      usage: ['<User:ID>'],
      category: 'Moderation',
      userPermissions: ['MANAGE_CHANNELS'],
      guildOnly: true
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    if (!args.length) {
      message.channel.send(`You did not provide a member to mute`).catch(console.error);
      return;
    }

    const member = message.guild?.members.cache.find(member => member.id === args[0]);
    if (!member) {
      message.channel.send(`Could not find that member, try using valid UserID`).catch(console.error);
      return;
    }

    if (!message.guild?.me?.hasPermission('MANAGE_CHANNELS')) {
      message.channel.send(`I don't have enough permissions, \`MANAGE_CHANNELS\` needed`).catch(console.error);
      return;
    }

    message.guild.channels.cache.forEach(async (channel) => {
      if (!channel.manageable) return;
      await channel.permissionOverwrites.get(member.id)?.delete();
    });

    message.channel.send(`\`${member.user.username}\` has been unmuted`).catch(console.error);
  }
}