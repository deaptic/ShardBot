import { GuildMember, MessageEmbed, Guild, User, Message } from 'discord.js';

// memberJoin
export async function memberJoin(member: GuildMember) {
  const embed = new MessageEmbed()
    .setColor('BLUE')
    .setAuthor(`${member.user.tag} has joined the server!`, member.user.displayAvatarURL() ?? member.user.defaultAvatarURL);

  return embed;
}

// memberLeft
export async function memberLeft(member: GuildMember) {
  const embed = new MessageEmbed()
    .setColor('BLUE')
    .setAuthor(`${member.user.tag} has left the server!`, member.user.displayAvatarURL() ?? member.user.defaultAvatarURL);

  return embed;
}

// memberBanned
export async function memberBanned(guild: Guild, user: User) {
  const embed = new MessageEmbed()
    .setColor('ORANGE')
    .setAuthor(`${user.tag} has been banned!`, user.displayAvatarURL() ?? user.defaultAvatarURL);

  return embed;
}

// memberUnbanned
export async function memberUnbanned(guild: Guild, user: User) {
  const embed = new MessageEmbed()
    .setColor('ORANGE')
    .setAuthor(`${user.tag} has been unbanned!`, user.displayAvatarURL() ?? user.defaultAvatarURL);

  return embed;
}

// messageDelete
export async function messageDelete(message: Message) {
  const embed = new MessageEmbed()
    .setColor('YELLOW')
    .setAuthor(`${message.author.tag} deleted a message!`, message.author.displayAvatarURL() ?? message.author.defaultAvatarURL)
    .addField('Content', message.content);

  return embed;
}

// messageUpdate
export async function messageUpdate(oldMessage: Message, newMessage: Message) {
  const embed = new MessageEmbed()
    .setColor('YELLOW')
    .setAuthor(`${oldMessage.author.tag} updated a message!`, oldMessage.author.displayAvatarURL() ?? oldMessage.author.defaultAvatarURL)
    .addField('From', oldMessage.content)
    .addField('To', newMessage.content);

  return embed;
}