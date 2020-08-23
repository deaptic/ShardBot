import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";

export default class Ping extends Command {
  constructor () {
    super({
      name: 'invite',
      description: 'Responds with bot invite link',
      category: 'General',
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    message.channel.send(await client.generateInvite(8)).catch(console.error);
  }
}