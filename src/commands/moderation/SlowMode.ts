import Command from '../../base/classes/Command';
import { Client, Message, TextChannel } from "discord.js";

export default class SlowMode extends Command {
  constructor () {
    super({
      name: 'slowmode',
      description: 'Enables or Disables slowmode in a channel',
      usage: ['<Duration?:Number>'],
      category: 'Moderation',
      userPermissions: ['MANAGE_CHANNELS'],
      guildOnly: true
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    let rateLimitPerUser = parseInt(args[0]) || 0;
    if (rateLimitPerUser > 21600) rateLimitPerUser = 21600;

    let reason = args.slice(1).join(' ');
    if (!reason.length) reason = 'No reason specified';

    const channel = message.channel as TextChannel;
    await channel.setRateLimitPerUser(rateLimitPerUser, reason).then(() => {
      message.channel.send(`Slowmode has been set to \`${rateLimitPerUser}\` for ${reason}`);
    });
  }
}