import { Permission } from '@enum/Permission';
import { CommandStore, Command, KlasaMessage, KlasaUser, KlasaGuild } from 'klasa';
import { User } from 'discord.js';

module.exports = class extends Command {

	private terms: Array<string>;

	public constructor(store: CommandStore, file: string[], dir: string) {
		super(store, file, dir, {
			permissionLevel: Permission.OwnerHidden,
			description: language => language.get('COMMAND_BLACKLIST_DESCRIPTION'),
			usage: '<User:user|Guild:guild|guild:str> [...]',
			usageDelim: ' ',
			guarded: true
		});

		this.terms = ['usersAdded', 'usersRemoved', 'guildsAdded', 'guildsRemoved'];
	}

	public async run(message: KlasaMessage, usersAndGuilds: Array<KlasaUser | KlasaGuild>) {
		const changes: Array<any> = [[], [], [], []];
		const queries: Array<any> = [[], []];

		for (const userOrGuild of new Set(usersAndGuilds)) {
			const type = userOrGuild instanceof User ? 'user' : 'guild';
			if ((this.client.settings!.get(`${type}Blacklist`) as Array<any>).includes(userOrGuild.id || userOrGuild)) {
				changes[this.terms.indexOf(`${type}sRemoved`)].push((userOrGuild as KlasaGuild).name || (userOrGuild as KlasaUser).username || userOrGuild);
			} else {
				changes[this.terms.indexOf(`${type}sAdded`)].push((userOrGuild as KlasaGuild).name || (userOrGuild as KlasaUser).username || userOrGuild);
			}
			queries[Number(type === 'guild')].push(userOrGuild.id || userOrGuild);
		}

		const { errors } = await this.client.settings!.update([['userBlacklist', queries[0]], ['guildBlacklist', queries[1]]]);
		if (errors.length) throw String(errors[0]);

		return message.sendLocale('COMMAND_BLACKLIST_SUCCESS', changes);
	}

};
