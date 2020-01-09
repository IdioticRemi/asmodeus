import { ShardingManager as KurasutaShardingManager, SharderOptions } from 'kurasuta';
import { KlasaConsole, ConsoleOptions } from 'klasa';

import { AsmodeusConfig } from '@lib/typings';
import { configEnv } from '@utils/configEnv';

export class ShardingManager extends KurasutaShardingManager {

	public config: AsmodeusConfig;
	public options: CustomSharderOptions;
	public console: KlasaConsole;

	public constructor(path: string) {
		const options = configEnv();

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
