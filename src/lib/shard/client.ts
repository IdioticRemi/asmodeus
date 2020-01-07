import { KlasaClient, KlasaClientOptions } from 'klasa';

export class AsmodeusClient extends KlasaClient {

	public accent: string;
	public constructor(options: CustomClientOptions) {
		super(options);

		this.accent = options.accent;
	}

}

export interface CustomClientOptions extends KlasaClientOptions {
	accent: string;
}
