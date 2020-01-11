import { Command, CommandStore, KlasaMessage } from 'klasa';
import { Permission } from '@enum/Permission';
import { GuildSchema } from '@lib/types/settings/GuildSchema';
import { Role } from 'discord.js';

export default class extends Command {

	public constructor(store: CommandStore, file: string[], dir: string) {
		super(store, file, dir, {
			permissionLevel: Permission.GuildOwner,
			bucket: 2,
			cooldown: 15,
			description: language => language.get('COMMAND_ADMINROLE_DESCRIPTION'),
			subcommands: true,
			usage: '<show|set|reset> (Role:role)',
			usageDelim: ' '
		});

		this.createCustomResolver('role', (arg, possible, message, params) => {
			if (params.length && ['set'].includes(params[0])) {
				return this.client.arguments.get('role')!.run(arg, possible, message);
			}

			return undefined;
		});
	}

	public async show(message: KlasaMessage) {
		const roleID = await message.guild!.settings.get(GuildSchema.Roles.Admin);

		if (!roleID || !message.guild?.roles.has(roleID as string)) return message.sendLocale('COMMAND_ADMINROLE_SHOW_NULL');

		await message.sendLocale('COMMAND_ADMINROLE_SHOW', [message.guild?.roles.get(roleID as string)]);
	}

	public async set(message: KlasaMessage, [role]: [Role]) {
		await message.guild!.settings.update(GuildSchema.Roles.Admin, role);

		await message.sendLocale('COMMAND_ADMINROLE_SET', [role]);
	}

	public async reset(message: KlasaMessage) {
		await message.guild!.settings.reset(GuildSchema.Roles.Admin);

		await message.sendLocale('COMMAND_ADMINROLE_RESET');
	}

}
