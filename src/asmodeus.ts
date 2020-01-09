import 'module-alias/register';

import '@lib/setup/permissionLevels';
import '@lib/setup/gateways';

import { join } from 'path';
import { ShardingManager } from '@shard/manager';
import { SharderEvents } from 'kurasuta';
import { Colors } from 'klasa';

const manager = new ShardingManager(join(__dirname, './lib/shard/cluster'));

manager.on(SharderEvents.SHARD_READY, shardID => {
	manager.console.log([
		new Colors({
			text: 'black',
			background: 'cyan'
		}).format(`[SHARD ${shardID}]`),
		`Shard ${shardID} is ready!`
	].join(' '));
});

manager.on(SharderEvents.SPAWN, cluster => {
	manager.console.log([
		new Colors({
			text: 'black',
			background: 'cyan'
		}).format(`[CLUSTER ${cluster.id}]`),
		`Spawned cluster ${cluster.id}!`
	].join(' '));
});

manager.on(SharderEvents.READY, cluster => {
	manager.console.log([
		new Colors({
			text: 'black',
			background: 'cyan'
		}).format(`[CLUSTER ${cluster.id}]`),
		`Cluster ${cluster.id} is ready!`
	].join(' '));
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
manager.spawn();
