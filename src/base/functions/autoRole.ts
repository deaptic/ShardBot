import { GuildMember } from 'discord.js';
import GuildExtension from '../structures/Guild';

export default async function autoRole(member: GuildMember) {
  const guild = member.guild as GuildExtension;
  const database = await guild.database;

  if (database.autoRole) {
    if (member.user.bot) return;

    if (!guild.me?.hasPermission('MANAGE_ROLES')) return;

    const botHighestRole = member.guild.me?.roles.highest!;
    const isRole = member.guild.roles.cache.find(r => r.id === database.autoRole);
    const hasRole = member.roles.cache.find(r => r.id === database.autoRole);

    if (isRole && !hasRole) {
      if (botHighestRole.position < isRole.position) return;
      member.roles.add(isRole).catch(console.error);
    }
  }
}