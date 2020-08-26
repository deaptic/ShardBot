import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";

export default class Mute extends Command {
  constructor () {
    super({
      name: 'mute',
      description: 'Mutes a member',
      usage: ['<User:ID> <Reason?:Text>'],
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
      await channel.overwritePermissions([
        {
          id: member.id,
          deny: ['SEND_MESSAGES', 'ADD_REACTIONS']
        }
      ]);
    });

    args.splice(0, 1);

    let reason = '';
    if (args.length) {
      reason = `for a reason: \`${args.join(' ')}\``;
    }

    message.channel.send(`\`${member.user.username}\` has been muted ${reason}`).catch(console.error);
  }
}