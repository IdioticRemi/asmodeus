import { KlasaMessage, Piece, Command, CommandStore } from 'klasa';
import { Permission } from '@enum/Permission';

module.exports = class extends Command {

	public constructor(store: CommandStore, file: string[], dir: string) {
		super(store, file, dir, {
			aliases: ['u'],
			permissionLevel: Permission.OwnerHidden,
			guarded: true,
			description: language => language.get('COMMAND_UNLOAD_DESCRIPTION'),
			usage: '<Piece:piece>'
		});
	}

	public async run(message: KlasaMessage, [piece]: [Piece]) {
		if ((piece.type === 'event' && piece.name === 'message') || (piece.type === 'monitor' && piece.name === 'commandHandler')) {
			return message.sendLocale('COMMAND_UNLOAD_WARN');
		}
		piece.unload();
		if (this.client.shard) {
			await this.client.shard.broadcastEval(`
				if (String(this.options.shards) !== '${this.client.options.shards}') this.${piece.store}.get('${piece.name}').unload();
			`);
		}
		return message.sendLocale('COMMAND_UNLOAD', [piece.type, piece.name]);
	}

};
