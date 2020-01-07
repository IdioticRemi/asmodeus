import { Command, CommandStore, KlasaMessage } from 'klasa';

export default class extends Command {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {

		});
	}

	// @ts-ignore
	public async run(message: KlasaMessage) {

	}

}
