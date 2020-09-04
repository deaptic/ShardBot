import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";

export default class Kick extends Command {
  constructor () {
    super({
      name: 'kick',
      description: 'Kicks a member',
      usage: ['<User:ID> <?Reason:Text>'],
      category: 'Moderation',
      guildOnly: true,
      userPermissions: ['KICK_MEMBERS'],
      botPermissions: ['KICK_MEMBERS'],
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    if (!args.length) {
      message.channel.send(`You did not provide a user id`).catch(e => console.error(e));
      return;
    }

    const member = message.guild?.members.cache.find(member => member.id === args[0]);
    if (!member) {
      message.channel.send(`Could not find that user. A valid user id needed`).catch(e => console.error(e));
      return;
    }

    if (!member.kickable) {
      message.channel.send(`Cannot do that. Check my permissions`).catch(e => console.error(e));
      return;
    }

    let reason = args.slice(1).join(' ');
    if (!reason.length) reason = 'no specified reason';

    member.kick(reason).then(() => {
      message.channel.send(`\`${member.user.username}\` has been kicked for \`${reason}\``).catch(e => console.error(e));
    }).catch(e => console.error(e));
  }
}