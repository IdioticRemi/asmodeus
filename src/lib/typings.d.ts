import { CustomSharderOptions } from '@shard/manager';
import { CustomClientOptions } from '@shard/client';

export interface AsmodeusConfig {
	KEYS: any;
	SHARDING_MANAGER_OPTIONS: CustomSharderOptions;
	CLIENT_OPTIONS: CustomClientOptions;
}
