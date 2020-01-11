import { Command, CommandStore, Stopwatch, KlasaMessage } from 'klasa';
import { pathExists } from 'fs-nextra';
import { join } from 'path';
import { Permission } from '@enum/Permission';

module.exports = class extends Command {

	private regExp: RegExp;

	public constructor(store: CommandStore, file: string[], dir: string) {
		super(store, file, dir, {
			aliases: ['l'],
			permissionLevel: Permission.OwnerHidden,
			guarded: true,
			description: language => language.get('COMMAND_LOAD_DESCRIPTION'),
			usage: '[core] <Store:store> <path:...string>',
			usageDelim: ' '
		});
		this.regExp = /\\\\?|\//g;
	}

	// @ts-ignore
	public async run(message: KlasaMessage, [core, store, path]) {
		path = (path.endsWith('.js') ? path : `${path}.js`).split(this.regExp);
		const timer = new Stopwatch();
		const piece = await (core ? this.tryEach(store, path) : store.load(store.userDirectory, path));

		try {
			if (!piece) throw message.language.get('COMMAND_LOAD_FAIL');
			await piece.init();
			if (this.client.shard) {
				await this.client.shard.broadcastEval(`
					if (String(this.options.shards) !== '${this.client.options.shards}') {
						const piece = this.${piece.store}.load('${piece.directory}', ${JSON.stringify(path)});
						if (piece) piece.init();
					}
				`);
			}
			return message.sendLocale('COMMAND_LOAD', [timer.stop(), store.name, piece.name]);
		} catch (error) {
			timer.stop();
			throw message.language.get('COMMAND_LOAD_ERROR', store.name, piece ? piece.name : path.join('/'), error);
		}
	}

	// @ts-ignore
	private async tryEach(store, path) {
		for (const dir of store.coreDirectories) if (await pathExists(join(dir, ...path))) return store.load(dir, path);
		return undefined;
	}

};
