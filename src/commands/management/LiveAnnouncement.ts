import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";
import GuildExtension from '../../base/structures/Guild';
export default class Live extends Command {
  constructor () {
    super({
      name: 'live',
      description: 'Sent announcement when specified users go live',
      usage: [
        '<channel> <set/delete> <Channel:ID>',
        '<user> <add/remove/list> <User[...]:ID>'
      ],
      category: 'Management',
      guildOnly: true,
      userPermissions: ['ADMINISTRATOR'],
      botPermissions: ['SEND_MESSAGES'],
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
              database.liveAnnouncements.channel = message.channel.id;
              await database.save();
              message.channel.send('This channel has set to be an announcement channel').catch(console.error);
              return;
            }

            const channel = message.guild?.channels.cache.find(ch => ch.id === args[2]);
            if (!channel) {
              message.channel.send('Could not find that channel, provide a valid channel id').catch(console.error);
              return;
            }

            database.liveAnnouncements.channel = channel.id;
            await database.save();
            message.channel.send(`${channel} has set to be an announcement channel`).catch(console.error);
            break;

          case 'delete':
            database.liveAnnouncements.channel = undefined;
            database.save();
            message.channel.send(`Logging channel removed`).catch(console.error);
            break;

          default:
            message.channel.send(`You didn\'t provide a correct parameter, try using \`set\` or \`delete\``).catch(console.error);
            break;
        }
        break;

      case 'user':
        switch (args[1]) {
          case 'add':
            args.splice(0, 2);
            if (!args.length) {
              message.channel.send(`Please provide an user id`).catch(console.error);
              return;
            }

            let addedUsers: string[] = [];
            args.forEach(user => {
              const isUser = message.guild?.members.cache.find(m => m.id === user);
              if (!isUser) return;

              const hasUser = database.liveAnnouncements.users.find((u: string) => u === user);
              if (hasUser) return;

              database.liveAnnouncements.users.push(isUser.user.id);
              addedUsers.push(isUser.user.username);
            });

            if (!addedUsers.length) {
              message.channel.send(`No new users added`).catch(console.error);
              return;
            }

            await database.save();
            message.channel.send(`Added users:\n\`\`\`${addedUsers.sort().join(', ')}\`\`\``).catch(console.error);
            break;

          case 'remove':
            args.splice(0, 2);
            if (!args.length) {
              message.channel.send(`Please provide an user id`).catch(console.error);
              return;
            }

            let removedUsers: string[] = [];
            args.forEach(user => {
              const hasUser = database.liveAnnouncements.users.find((u: string) => u === user);
              if (!hasUser) return;

              database.liveAnnouncements.users.pull(user);
              removedUsers.push(user);
            });

            if (!removedUsers.length) {
              message.channel.send(`No users removed`).catch(console.error);
              return;
            }

            await database.save();
            message.channel.send(`Removed users:\n\`\`\`${removedUsers.sort().join(', ')}\`\`\``).catch(console.error);
            break;

          case 'list':
            message.channel.send(`All available EventTypes:\n\`\`\`${database.liveAnnouncements.users.sort().join(', ')}\`\`\``).catch(console.error);
            break;

          default:
            message.channel.send(`You didn\'t provide a correct parameter, try using \`add\` or \`remove\``).catch(console.error);
            break;
        }
        break;

      default:
        message.channel.send(`You didn\'t provide a correct parameter, try using \`channel\` or \`user\``).catch(console.error);
        break;
    }
  }
}