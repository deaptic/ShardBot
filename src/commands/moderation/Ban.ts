import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";

export default class Ban extends Command {
  constructor () {
    super({
      name: 'ban',
      description: 'Bans a member',
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

    const member = message.guild?.members.cache.find(member => member.id === args[0]);
    if (!member) {
      message.channel.send(`Could not find that user. A valid user id needed`).catch(console.error);
      return;
    }

    if (!member.bannable) {
      message.channel.send(`Cannot do that. Check my permissions`).catch(console.error);
      return;
    }

    args.splice(0, 1);

    let reason = '';
    if (args.length) {
      reason = `for a reason: \`${args.join(' ')}\``;
    }

    member.kick(reason).then(() => {
      message.channel.send(`\`${member.user.username}\` has been banned ${reason}`).catch(console.error);
    }).catch(console.error);
  }
}