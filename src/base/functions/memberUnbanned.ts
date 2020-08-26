import { MessageEmbed, User } from 'discord.js';

export default async function memberUnbanned(user: User) {
  const embed = new MessageEmbed()
    .setColor('ORANGE')
    .setAuthor(`${user.tag} has been unbanned!`, user.displayAvatarURL() ?? user.defaultAvatarURL);

  return embed;
}