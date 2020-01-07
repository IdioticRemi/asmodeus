import { CustomSharderOptions } from '@shard/manager';
import { CustomClientOptions, AsmodeusClient } from '@shard/client';

export const KEYS = {
	DISCORD: '',
	YOUTUBE: ''
};

export const CLIENT_OPTIONS: CustomClientOptions = {
	accent: 0xFF7AF6,
	prefix: ['as!'],
	language: 'en',
	slowmode: 750,
	production: true,
	slowmodeAggressive: true,
	pieceDefaults: {
		commands: {
			cooldown: 3,
			flagSupport: false,
			quotedStringSupport: true
		}
	},

	// Client Optimisation for less RAM/CPU usage
	messageSweepInterval: 150,
	messageCacheLifetime: 900,
	messageCacheMaxSize: 300,
	fetchAllMembers: false
};

export const SHARDING_MANAGER_OPTIONS: CustomSharderOptions = {
	consoleOptions: { colors: { log: { time: { background: 'lightblue' } } } },
	clientOptions: CLIENT_OPTIONS,
	client: AsmodeusClient,

	clusterCount: 2,
	shardCount: 4
};
