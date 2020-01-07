import { CustomSharderOptions } from '@lib/shard/manager';
import { KlasaClientOptions, Client } from 'klasa';

export const KEYS = {
	DISCORD: '',
	YOUTUBE: ''
};

export const CLIENT_OPTIONS: KlasaClientOptions = {
	prefix: ['as!'],
	messageSweepInterval: 150,
	messageCacheLifetime: 900,
	messageCacheMaxSize: 100
};

export const SHARDING_MANAGER_OPTIONS: CustomSharderOptions = {
	consoleOptions: { colors: { log: { time: { background: 'lightblue' } } } },
	clientOptions: CLIENT_OPTIONS,
	client: Client,

	clusterCount: 2,
	shardCount: 4
};
