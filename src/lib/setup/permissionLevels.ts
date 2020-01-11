import { PermissionLevels } from 'klasa';
import { Role, Permissions } from 'discord.js';
import { Permission } from '@enum/Permission';
import { AsmodeusClient } from '@shard/client';
import { AsmodeusConfig } from '@lib/typings';
import { configEnv } from '@utils/configEnv';
import { GuildSchema } from '@lib/types/settings/GuildSchema';

const config: AsmodeusConfig = configEnv();

AsmodeusClient.defaultPermissionLevels = new PermissionLevels()
	.add(Permission.Default, () => true)

	.add(Permission.Moderator, message => message.member
		? message.guild!.settings.get(GuildSchema.Roles.Moderator)
			? message.member.roles.has(message.guild!.settings.get(GuildSchema.Roles.Moderator) as string)
			: message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)
		: false, { fetch: true })
	.add(Permission.Administrator, message => message.member
		? message.guild!.settings.get(GuildSchema.Roles.Admin)
			? message.member.roles.has(message.guild!.settings.get(GuildSchema.Roles.Admin) as string)
			: message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)
		: false, { fetch: true })
	.add(Permission.GuildOwner, message => message.guild ? message.member === message.guild!.owner : false, { fetch: true })

	.add(Permission.BotSupport, message => {
		const member = message.client.guilds.get(config.OTHER.SUPPORT.GUILD)!.member(message.author.id);
		if (!member) return false;
		const map = member.roles.map((r: Role) => config.OTHER.SUPPORT.ROLES.includes(r.name.toLowerCase()));
		return map.includes(true);
	}, { fetch: true })

	.add(Permission.Owner, message => message.client.owners.has(message.author), { 'break': true })
	.add(Permission.OwnerHidden, message => message.client.owners.has(message.author));
