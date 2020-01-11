import { Command, CommandStore, KlasaMessage, Piece } from 'klasa';
import { Permission } from '@enum/Permission';


module.exports = class extends Command {

	public constructor(store: CommandStore, file: string[], dir: string) {
		super(store, file, dir, {
			permissionLevel: Permission.OwnerHidden,
			guarded: true,
			description: language => language.get('COMMAND_ENABLE_DESCRIPTION'),
			usage: '<Piece:piece>'
		});
	}

	public async run(message: KlasaMessage, [piece]: [Piece]) {
		piece.enable();
		if (this.client.shard) {
			await this.client.shard.broadcastEval(`
				if (String(this.options.shards) !== '${this.client.options.shards}') this.${piece.store}.get('${piece.name}').enable();
			`);
		}
		return message.sendCode('diff', message.language.get('COMMAND_ENABLE', piece.type, piece.name));
	}

};
