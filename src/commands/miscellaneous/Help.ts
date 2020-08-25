import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";

export default class Help extends Command {
  constructor () {
    super({
      name: 'help',
      description: 'Shows help about all or one specific command',
      usage: ['CommandName'],
      category: 'Miscellaneous',
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    message.channel.send('Command not yet implemented!').catch(console.error);
    return;
  }
}