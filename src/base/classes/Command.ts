import { PermissionString } from 'discord.js';

export default class Command {
  public name: string;
  public description: string;
  public usage: string[];
  public category: string;
  public enabled: boolean;
  public guildOnly: boolean;
  public aliases: string[];
  public userPermissions: PermissionString[];

  constructor ({
    name = 'No name provided',
    description = 'No description',
    usage = new Array(),
    category = 'Miscellaneous',
    enabled = true,
    guildOnly = false,
    aliases = new Array(),
    userPermissions = new Array(),
  }) {
    this.name = name;
    this.description = description;
    this.usage = usage;
    this.category = category;
    this.enabled = enabled;
    this.guildOnly = guildOnly;
    this.aliases = aliases;
    this.userPermissions = userPermissions;
  }
}