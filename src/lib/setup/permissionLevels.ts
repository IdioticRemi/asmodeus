import { KlasaGuild, KlasaUser, PermissionLevels, KlasaClient } from 'klasa';
import { Permissions, GuildMember, Role } from 'discord.js';
import { Permission } from '@enum/Permission';
import { AsmodeusClient } from '@shard/client';

AsmodeusClient.defaultPermissionLevels = new PermissionLevels()
	.add(Permission.Default, () => true)

	// @ts-ignore
	.add(Permission.Kick, ({ guild, member }: PermissionsLevelGuildMember) => guild && member.permissions.has(Permissions.FLAGS.KICK_MEMBERS), { fetch: true })
	.add(Permission.Ban, ({ guild, member }: PermissionsLevelGuildMember) => guild && member.permissions.has(Permissions.FLAGS.BAN_MEMBERS), { fetch: true })
	.add(Permission.ManageGuild, ({ guild, member }: PermissionsLevelGuildMember) => guild && member.permissions.has(Permissions.FLAGS.MANAGE_GUILD), { fetch: true })
	.add(Permission.Administrator, ({ guild, member }: PermissionsLevelGuildMember) => guild && member.permissions.has(Permissions.FLAGS.ADMINISTRATOR), { fetch: true })
	.add(Permission.GuildOwner, ({ guild, member }: PermissionsLevelGuildMember) => guild && member === guild.owner, { fetch: true })
	.add(Permission.BotSupport, ({ author, client }: PermissionsLevelAuthorClient) => {
		const member = client.guilds.get('594975995178778644')?.member(author.id);
		if (!member) return false;
		const map = member.roles.map((r: Role) => ['Moderators', 'Admins'].includes(r.name));
		return map.includes(true);
	}, { fetch: true })

	.add(Permission.Owner, ({ author, client }: PermissionsLevelAuthorClient) => client.owners.has(author), { 'break': true })
	.add(Permission.OwnerHidden, ({ author, client }: PermissionsLevelAuthorClient) => client.owners.has(author));

interface PermissionsLevelAuthorClient {
	author: KlasaUser;
	client: KlasaClient;
}

interface PermissionsLevelGuildMember {
	guild: KlasaGuild;
	member: GuildMember;
}
