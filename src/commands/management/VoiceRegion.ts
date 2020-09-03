import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";

export default class Prefix extends Command {
  constructor () {
    super({
      name: 'voiceregion',
      description: 'Show and change guild\'s voice region',
      usage: ['<?Region:RegionFlag>'],
      category: 'Management',
      guildOnly: true,
      aliases: ['region'],
      userPermissions: ['MANAGE_GUILD'],
      botPermissions: ['MANAGE_GUILD'],
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    if (!args.length) {
      message.channel.send(`Guild voice region is currently \`${message.guild?.region}\``).catch(e => console.error(e.message));
      return;
    }

    try {
      const updated = await message.guild?.setRegion(args[0]);
      message.channel.send(`Updated guild region to ${updated?.region}`);
      return;
    }
    catch {
      const list = (await message.guild?.fetchVoiceRegions())?.keyArray().sort().join('\n');
      message.channel.send(`\`\`\`Available regions:\n\n${list}\`\`\``);
      return;
    }
  }
}