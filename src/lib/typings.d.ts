import { CustomSharderOptions } from '@shard/manager';
import { CustomClientOptions } from '@shard/client';
import { Snowflake } from 'discord.js';

export interface AsmodeusConfig {
	KEYS: any;
	OTHER: {
		SUPPORT: {
			ROLES: Array<Snowflake>;
			GUILD: Snowflake;
		};
	};
	SHARDING_MANAGER_OPTIONS: CustomSharderOptions;
	CLIENT_OPTIONS: CustomClientOptions;
}
