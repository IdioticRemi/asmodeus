import { Command, CommandStore, KlasaMessage } from 'klasa';
import { Permission } from '@enum/Permission';

module.exports = class extends Command {

	public constructor(store: CommandStore, file: string[], dir: string) {
		super(store, file, dir, {
			permissionLevel: Permission.OwnerHidden,
			guarded: true,
			description: language => language.get('COMMAND_REBOOT_DESCRIPTION')
		});
	}

	// @ts-ignore
	public async run(message: KlasaMessage) {
		await message.sendLocale('COMMAND_REBOOT').catch(err => this.client.emit('error', err));
		await Promise.all(this.client.providers.map(provider => provider.shutdown()));
		process.exit();
	}

};
