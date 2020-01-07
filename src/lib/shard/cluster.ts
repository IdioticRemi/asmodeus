import { BaseCluster } from 'kurasuta';
import { ShardingManager } from '@lib/shard/manager';

export default class extends BaseCluster {

	public async launch() {
		await this.client.login((this.manager as ShardingManager).config.KEYS.DISCORD);
	}

}
