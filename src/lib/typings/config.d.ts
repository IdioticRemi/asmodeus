import { CustomSharderOptions } from '@lib/shard/manager';
import { KlasaClientOptions } from 'klasa';

export default interface AsmodeusConfig {
	KEYS: any;
	SHARDING_MANAGER_OPTIONS: CustomSharderOptions;
	CLIENT_OPTIONS: KlasaClientOptions;
}
