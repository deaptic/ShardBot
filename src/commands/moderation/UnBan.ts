import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";

export default class UnBan extends Command {
  constructor () {
    super({
      name: 'unban',
      description: 'Removes a member ban',
      usage: ['<User:ID> <Reason?:Text>'],
      category: 'Moderation',
      userPermissions: ['BAN_MEMBERS'],
      guildOnly: true
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    if (!args.length) {
      message.channel.send(`You did not provide a user id`).catch(console.error);
      return;
    }

    const fetchedBans = await message.guild?.fetchBans();
    if (!fetchedBans?.size) {
      message.channel.send(`Could not find any banned users in this guild`).catch(console.error);
      return;
    }

    const member = fetchedBans.find(m => m.user.id === args[0]);
    if (!member) {
      message.channel.send(`Could not find that user. Did you use a valid id?`).catch(console.error);
      return;
    }

    let reason = args.slice(1).join(' ');
    if (!reason.length) reason = 'no specified reason';

    message.guild?.members.unban(member.user, reason).then(() => {
      message.channel.send(`\`${member.user.username}\` has been unbanned for \`${reason}\``).catch(console.error);
    }).catch(console.error);
  }
}