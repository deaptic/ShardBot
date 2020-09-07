import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";

export default class extends Command {
  constructor () {
    super({
      name: 'invite',
      description: 'Responds with bot invite link',
      category: 'Information',
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    const invite = await client.generateInvite(470805751).catch(e => console.error(e));
    message.channel.send(invite).catch(e => console.error(e));
  }
}