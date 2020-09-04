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
              message.channel.send('This channel has set to be an announcement channel').catch(e => console.error(e));
              return;
            }

            const channel = message.guild?.channels.cache.find(ch => ch.id === args[2]);
            if (!channel) {
              message.channel.send('Could not find that channel, provide a valid channel id').catch(e => console.error(e));
              return;
            }

            database.liveAnnouncements.channel = channel.id;
            await database.save();
            message.channel.send(`${channel} has set to be an announcement channel`).catch(e => console.error(e));
            break;

          case 'delete':
            database.liveAnnouncements.channel = undefined;
            database.save();
            message.channel.send(`Logging channel removed`).catch(e => console.error(e));
            break;

          default:
            message.channel.send(`You didn\'t provide a correct parameter, try using \`set\` or \`delete\``).catch(e => console.error(e));
            break;
        }
        break;

      case 'user':
        switch (args[1]) {
          case 'add':
            args.splice(0, 2);
            if (!args.length) {
              message.channel.send(`Please provide an user id`).catch(e => console.error(e));
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
              message.channel.send(`No new users added`).catch(e => console.error(e));
              return;
            }

            await database.save();
            message.channel.send(`Added users:\n\`\`\`${addedUsers.sort().join(', ')}\`\`\``).catch(e => console.error(e));
            break;

          case 'remove':
            args.splice(0, 2);
            if (!args.length) {
              message.channel.send(`Please provide an user id`).catch(e => console.error(e));
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
              message.channel.send(`No users removed`).catch(e => console.error(e));
              return;
            }

            await database.save();
            message.channel.send(`Removed users:\n\`\`\`${removedUsers.sort().join(', ')}\`\`\``).catch(e => console.error(e));
            break;

          case 'list':
            message.channel.send(`All available EventTypes:\n\`\`\`${database.liveAnnouncements.users.sort().join(', ')}\`\`\``).catch(e => console.error(e));
            break;

          default:
            message.channel.send(`You didn\'t provide a correct parameter, try using \`add\` or \`remove\``).catch(e => console.error(e));
            break;
        }
        break;

      default:
        message.channel.send(`You didn\'t provide a correct parameter, try using \`channel\` or \`user\``).catch(e => console.error(e));
        break;
    }
  }
}