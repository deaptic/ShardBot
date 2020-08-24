import { Client, Presence } from 'discord.js';
import Event from '../base/classes/Event';
import GuildExtension from '../base/structures/Guild';

export default class ReadyEvent extends Event {

  constructor () {
    super('presenceUpdate');
  }

  public async execute(client: Client, oldPresence: Presence, newPresence: Presence) {
    const guild = newPresence.guild as GuildExtension;
    const database = await guild.database;

    if (database.liveRole) {
      const isLive = newPresence.activities.find(a => a.type === 'STREAMING');
      const isRole = newPresence.guild?.roles.cache.find(r => r.id === database.liveRole);
      const hasRole = newPresence.member?.roles.cache.find(r => r.id === database.liveRole);
      const botHighestRole = newPresence.guild?.me?.roles.highest.position!;

      if (!newPresence.guild?.me?.hasPermission('MANAGE_ROLES')) return;
      if (isRole && botHighestRole < isRole.position) return;

      if (isLive && isRole && !hasRole) newPresence.member?.roles.add(isRole).catch(console.error);
      if (!isLive && isRole && hasRole) newPresence.member?.roles.remove(isRole).catch(console.error);
    }
  }
}