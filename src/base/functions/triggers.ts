import { Message } from 'discord.js';
import GuildExtension from '../structures/Guild';

export default async function triggers(message: Message) {
  const guild = message.guild as GuildExtension;
  const database = await guild.database;

  for await (const command of database.customCommands) {
    if (!command.triggers) return;
    for await (const trigger of command.triggers) {
      if (message.content.includes(trigger)) {
        message.channel.send(command.content);
      }
    }
  }
}