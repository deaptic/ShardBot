import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";
import GuildExtension from '../../base/structures/Guild';
import { eventTypes } from '../../base/data/loggerEvents.json';

export default class Logger extends Command {
  constructor () {
    super({
      name: 'logger',
      description: 'Setup logging channel and manage logged events',
      usage: ['<channel> <set/delete> <Channel:ID>', '<event> <add/remove/list> <Event:EventType>', '<reset>'],
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
            args.splice(0, 2);
            if (!args.length) {
              message.channel.send(`Please provide an event type. Available events: \`${eventTypes}\``).catch(console.error);
              return;
            }

            let addedEvents: string[] = [];
            args.forEach(event => {
              const isEvent = eventTypes.find(e => e === event);
              if (!isEvent) return;

              if (!database.log.events) {
                database.log.events.push(isEvent);
                addedEvents.push(isEvent);
                return;
              }

              const hasEvent = database.log.events.find((e: string) => e === event);
              if (hasEvent) return;

              database.log.events.push(isEvent);
              addedEvents.push(isEvent);
            });

            if (!addedEvents.length) {
              message.channel.send(`No new events added`).catch(console.error);
              return;
            }

            await database.save();
            message.channel.send(`Added logger events:\n\`\`\`${addedEvents.sort().join(', ')}\`\`\``).catch(console.error);
            break;

          case 'remove':
            args.splice(0, 2);

            if (!args.length) {
              message.channel.send(`Please provide an event type. Available events: \`${eventTypes}\``).catch(console.error);
              return;
            }

            let removedEvents: string[] = [];
            args.forEach(event => {
              const isEvent = eventTypes.find(e => e === event);
              if (!isEvent) return;

              if (!database.log.events) return;

              const hasEvent = database.log.events.find((e: string) => e === event);
              if (!hasEvent) return;

              database.log.events.pull(isEvent);
              removedEvents.push(isEvent);
            });

            if (!removedEvents.length) {
              message.channel.send(`No new events removed`).catch(console.error);
              return;
            }

            await database.save();
            message.channel.send(`Removed logger events:\n\`\`\`${removedEvents.sort().join(', ')}\`\`\``).catch(console.error);
            break;

          case 'list':
            message.channel.send(`All available EventTypes:\n\`\`\`${eventTypes.sort().join(', ')}\`\`\``).catch(console.error);
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