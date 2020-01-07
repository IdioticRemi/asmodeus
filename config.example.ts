import { CustomSharderOptions } from '@shard/manager';
import { CustomClientOptions, AsmodeusClient } from '@shard/client';

export const KEYS = {
	DISCORD: '',
	YOUTUBE: ''
};

export const CLIENT_OPTIONS: CustomClientOptions = {
	prefix: ['as!'],
	language: 'en',
	messageSweepInterval: 150,
	messageCacheLifetime: 900,
	messageCacheMaxSize: 100
};

export const SHARDING_MANAGER_OPTIONS: CustomSharderOptions = {
	consoleOptions: { colors: { log: { time: { background: 'lightblue' } } } },
	clientOptions: CLIENT_OPTIONS,
	client: AsmodeusClient,

	clusterCount: 2,
	shardCount: 4
};
