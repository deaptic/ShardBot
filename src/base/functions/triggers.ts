import { Message } from 'discord.js';
import GuildExtension from '../structures/Guild';

export default async function triggers(message: Message) {
  const guild = message.guild as GuildExtension;
  const database = await guild.database;

  for await (const trigger of database.triggers) {
    if (trigger.triggerType === 'contains') {
      if (message.content.includes(trigger.trigger)) {
        const command = database.customCommands.find((command: any) => command.name === trigger.command);
        if (command) {
          message.channel.send(command.content).catch(console.error);
        }
      }
    } else if (trigger.triggerType === 'startsWith') {
      if (message.content.startsWith(trigger.trigger)) {
        const command = database.customCommands.find((command: any) => command.name === trigger.command);
        if (command) {
          message.channel.send(command.content).catch(console.error);
        }
      }
    }
  }
}