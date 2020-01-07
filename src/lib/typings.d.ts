import { CustomSharderOptions } from '@shard/manager';
import { KlasaClientOptions } from 'klasa';

export interface AsmodeusConfig {
	KEYS: any;
	SHARDING_MANAGER_OPTIONS: CustomSharderOptions;
	CLIENT_OPTIONS: KlasaClientOptions;
}
