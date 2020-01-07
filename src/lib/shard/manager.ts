import { ShardingManager as KurasutaShardingManager, SharderOptions } from 'kurasuta';
import { KlasaConsole, ConsoleOptions } from 'klasa';

import { AsmodeusConfig } from '@lib/typings';
import * as PROD_OPTS from '@root/config';
import * as DEV_OPTS from '@root/config.dev';

export class ShardingManager extends KurasutaShardingManager {

	public config: AsmodeusConfig;
	public options: CustomSharderOptions;
	public console: KlasaConsole;

	public constructor(path: string, production: boolean) {
		let options;
		if (production) options = PROD_OPTS as AsmodeusConfig;
		else options = DEV_OPTS as AsmodeusConfig;

		super(path, options.SHARDING_MANAGER_OPTIONS);

		this.options = options.SHARDING_MANAGER_OPTIONS;
		this.config = options;

		// @ts-ignore
		this.console = new KlasaConsole(this.options.consoleOptions || {});
	}

}

export interface CustomSharderOptions extends SharderOptions {
	consoleOptions?: ConsoleOptions;
}
