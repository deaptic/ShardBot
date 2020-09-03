import Command from '../../base/classes/Command';
import { Client, Message, TextChannel } from "discord.js";

export default class SlowMode extends Command {
  constructor () {
    super({
      name: 'slowmode',
      description: 'Enables or Disables slowmode in a channel',
      usage: ['<Interval?:Number>'],
      category: 'Moderation',
      guildOnly: true,
      userPermissions: ['MANAGE_CHANNELS'],
      botPermissions: ['MANAGE_CHANNELS'],
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    let rateLimitPerUser = parseInt(args[0]) || 0;
    if (rateLimitPerUser > 21600) rateLimitPerUser = 21600;

    let reason = args.slice(1).join(' ');
    if (!reason.length) reason = 'no specified reason';

    const channel = message.channel as TextChannel;
    await channel.setRateLimitPerUser(rateLimitPerUser, reason).then(() => {
      message.channel.send(`Slowmode has been set to \`${rateLimitPerUser}s\` for \`${reason}\``);
    }).catch(console.error);
  }
}