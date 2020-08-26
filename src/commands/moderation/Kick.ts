import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";

export default class Kick extends Command {
  constructor () {
    super({
      name: 'kick',
      description: 'Kicks a member',
      usage: ['<User:ID> <Reason?:Text>'],
      category: 'Moderation',
      userPermissions: ['KICK_MEMBERS']
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    if (!args.length) {
      message.channel.send(`You did not provide a member to kick`).catch(console.error);
      return;
    }

    const member = message.guild?.members.cache.find(member => member.id === args[0]);
    if (!member) {
      message.channel.send(`Could not find that member, try using valid UserID`).catch(console.error);
      return;
    }

    if (!member.kickable) {
      message.channel.send(`Sorry but I cannot do that. Check my permissions`).catch(console.error);
      return;
    }

    args.splice(0, 1);
    if (args.length) args[0].replace(/"/g, '');

    let reason = '';
    if (args.length) {
      reason = `for a reason: \`${args.join(' ')}\``;
    }

    member.kick(reason).then(() => {
      message.channel.send(`\`${member.user.username}\` has been kicked ${reason}`).catch(console.error);
    }).catch(console.error);
  }
}