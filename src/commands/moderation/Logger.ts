import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";
import GuildExtension from '../../base/structures/Guild';
import { eventTypes } from '../../base/data/loggerEvents.json';

export default class Logger extends Command {
  constructor () {
    super({
      name: 'logger',
      description: 'Set log channel or add log events',
      usage: ['channel|event|reset', 'set|delete / add|remove', 'ChannelID / EventType'],
      category: 'Moderation',
      aliases: ['log'],
      userPermissions: ['MANAGE_CHANNELS'],
      guildOnly: true
    });
  }

  public async execute(client: Client, message: Message, args: string[]) {
    const guild = message.guild as GuildExtension;
    const database = await guild.database;

    switch (args[0]) {
      case 'channel':
        switch (args[1]) {
          case 'set':
            if (!args[2]) {
              database.log.channel = message.channel.id;
              await database.save();
              message.channel.send('This channel has set to be a logging channel').catch(console.error);
              return;
            }

            const channel = message.guild?.channels.cache.find(ch => ch.id === args[2]);
            if (!channel) {
              message.channel.send('Could not find that channel, provide a valid channel id').catch(console.error);
              return;
            }

            database.log.channel = channel.id;
            await database.save();
            message.channel.send(`${channel} is set to be a logging channel`).catch(console.error);
            break;

          case 'delete':
            database.log.channel = undefined;
            database.save();
            message.channel.send(`Logging channel removed`).catch(console.error);
            break;

          default:
            message.channel.send(`You didn\'t provide a correct parameter, try using \`set\` or \`delete\``).catch(console.error);
            break;
        }
        break;

      case 'event':
        switch (args[1]) {
          case 'add':
            if (!args[2]) {
              message.channel.send(`Please provide an event type. Available events: \`${eventTypes}\``).catch(console.error);
              return;
            }

            const isEvent = eventTypes.find(e => e === args[2]);
            if (!isEvent) {
              message.channel.send(`Please provide valid event type. Available events: \`${eventTypes}\``).catch(console.error);
              return;
            }

            if (database.log.events) {
              const hasEvent = database.log.events.find((e: string) => e === args[2]);
              if (hasEvent) {
                message.channel.send(`Logger has this event already`).catch(console.error);
                return;
              }
            }

            database.log.events.push(isEvent);
            database.save();
            message.channel.send(`Added \`${isEvent}\` event for logging`).catch(console.error);
            break;

          case 'remove':
            if (!args[2]) {
              message.channel.send(`Please provide an event type. Available events: \`${eventTypes}\``).catch(console.error);
              return;
            }

            const hasTheEvent = database.log.events.find((e: string) => e === args[2]);
            if (!hasTheEvent) {
              message.channel.send(`Could not find that event from the list`).catch(console.error);
              return;
            }

            database.log.events.pull(hasTheEvent);
            database.save();
            message.channel.send(`Removed \`${hasTheEvent}\` event from logging`).catch(console.error);
            break;

          default:
            message.channel.send(`You didn\'t provide a correct parameter, try using \`add\` or \`remove\``).catch(console.error);
            break;
        }
        break;

      case 'reset':
        database.log = undefined;
        database.save();
        message.channel.send(`Logger reset to defaults`).catch(console.error);
        break;
      default:
        message.channel.send(`You didn\'t provide a correct parameter, try using \`channel\` or \`event\``).catch(console.error);
        break;
    }
  }
}