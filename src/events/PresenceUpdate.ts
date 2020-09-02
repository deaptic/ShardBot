import { Client, Presence, TextChannel } from 'discord.js';
import Event from '../base/classes/Event';
import GuildExtension from '../base/structures/Guild';

export default class ReadyEvent extends Event {

  constructor () {
    super('presenceUpdate');
  }

  public async execute(client: Client, oldPresence: Presence, newPresence: Presence) {
    const guild = newPresence.guild as GuildExtension;
    const database = await guild.database;

    const wasStreaming = oldPresence?.activities.find(a => a.type === 'STREAMING');
    const isStreaming = newPresence.activities.find(a => a.type === 'STREAMING');

    const announcementChannel = newPresence.guild?.channels.cache.find(c => c.id === database.liveAnnouncements.channel);
    const listedUser = database.liveAnnouncements.users.find((u: string) => u === newPresence.user?.id);

    const guildHasRole = newPresence.guild?.roles.cache.find(r => r.id === database.liveRole);
    const memberHasRole = newPresence.member?.roles.cache.find(r => r.id === database.liveRole);

    const botHasSendPermission = newPresence.guild?.me?.hasPermission(['SEND_MESSAGES']);
    const botHasRolesPermission = newPresence.guild?.me?.hasPermission(['MANAGE_ROLES']);
    const botHasHighestRole = newPresence.guild?.me?.roles.highest.position!;

    if (!wasStreaming && isStreaming) {
      // Announcement
      if (announcementChannel && listedUser && botHasSendPermission) {
        const channel = announcementChannel as TextChannel;
        channel.send(`@everyone, ${newPresence.user?.username} went live at ${isStreaming.url}`);
      }
    }

    if (guildHasRole && botHasRolesPermission && guildHasRole.position < botHasHighestRole) {
      // Add Role
      if (isStreaming && !memberHasRole) {
        newPresence.member?.roles.add(guildHasRole).catch(console.error);
      }

      // Remove role
      if (!isStreaming && memberHasRole) {
        newPresence.member?.roles.remove(guildHasRole).catch(console.error);
      }
    }
  }
}