import * as fs from 'fs-nextra';
import { Command, CommandStore, KlasaMessage, Piece } from 'klasa';
import { join } from 'path';
import { resolve } from 'dns';
import { Permission } from '@enum/Permission';

module.exports = class extends Command {

	public constructor(store: CommandStore, file: string[], dir: string) {
		super(store, file, dir, {
			permissionLevel: Permission.OwnerHidden,
			guarded: true,
			description: language => language.get('COMMAND_TRANSFER_DESCRIPTION'),
			usage: '<Piece:piece>'
		});
	}

	public async run(message: KlasaMessage, [piece]: [Piece]) {
		const file = join(...piece.file);
		// @ts-ignore
		const fileLocation = resolve(piece.directory, file);
		await fs.access(fileLocation).catch(() => {
			throw message.language.get('COMMAND_TRANSFER_ERROR');
		});
		try {
			await fs.copy(fileLocation, join(piece.store.userDirectory, file));
			piece.store.load(piece.store.userDirectory, piece.file);
			if (this.client.shard) {
				await this.client.shard.broadcastEval(`
					if (String(this.options.shards) !== '${this.client.options.shards}') this.${piece.store}.load(${piece.store.userDirectory}, ${JSON.stringify(piece.file)});
				`);
			}
			return message.sendLocale('COMMAND_TRANSFER_SUCCESS', [piece.type, piece.name]);
		} catch (err) {
			this.client.emit('error', err.stack);
			return message.sendLocale('COMMAND_TRANSFER_FAILED', [piece.type, piece.name]);
		}
	}

};
