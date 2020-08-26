import { MessageEmbed, User } from 'discord.js';

export default async function memberBanned(user: User) {
  const embed = new MessageEmbed()
    .setColor('ORANGE')
    .setAuthor(`${user.tag} has been banned!`, user.displayAvatarURL() ?? user.defaultAvatarURL);

  return embed;
}