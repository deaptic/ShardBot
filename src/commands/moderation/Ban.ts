import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";

export default class Ban extends Command {
  constructor () {
    super({
      name: 'ban',
      description: 'Bans a member',
      usage: ['<User:ID> <?Reason:Text>'],
      category: 'Moderation',
      guildOnly: true,
      userPermissions: ['BAN_MEMBERS'],
      botPermissions: ['BAN_MEMBERS'],
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    if (!args.length) {
      message.channel.send(`You did not provide a user id`).catch(e => console.error(e.message));
      return;
    }

    const member = message.guild?.members.cache.find(member => member.id === args[0]);
    if (!member) {
      message.channel.send(`Could not find that user. A valid user id needed`).catch(e => console.error(e.message));
      return;
    }

    if (!member.bannable) {
      message.channel.send(`Cannot do that. Check my permissions`).catch(e => console.error(e.message));
      return;
    }

    let reason = args.slice(1).join(' ');
    if (!reason.length) reason = 'no specified reason';

    member.ban({ reason }).then(() => {
      message.channel.send(`\`${member.user.username}\` has been banned for \`${reason}\``).catch(e => console.error(e.message));
    }).catch(e => console.error(e.message));
  }
}