import { GuildMember, MessageEmbed } from 'discord.js';

export default async function memberLeft(member: GuildMember) {
  const embed = new MessageEmbed()
    .setColor('GREEN')
    .setAuthor(`${member.user.tag} has joined the server!`, member.user.displayAvatarURL() ?? member.user.defaultAvatarURL);

  return embed;
}