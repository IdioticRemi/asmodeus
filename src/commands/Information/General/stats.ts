import { version } from 'discord.js';
import { CommandStore, KlasaMessage, Command } from 'klasa';
import { loadavg, uptime } from 'os';

export default class extends Command {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['sts'],
			bucket: 2,
			cooldown: 15,
			description: language => language.get('COMMAND_STATS_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_STATS_EXTENDED')
		});
	}

	public async run(message: KlasaMessage) {
		return message.sendLocale('COMMAND_STATS', [this.generalStatistics, this.uptimeStatistics, this.usageStatistics]);
	}

	private get generalStatistics(): StatsGeneral {
		return {
			CHANNELS: this.client.channels.size.toLocaleString(),
			GUILDS: this.client.guilds.size.toLocaleString(),
			NODE_JS: process.version,
			USERS: this.client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString(),
			VERSION: `v${version}`
		};
	}

	private get uptimeStatistics(): StatsUptime {
		return {
			CLIENT: this.client.uptime!,
			HOST: uptime() * 1000,
			TOTAL: process.uptime() * 1000
		};
	}

	private get usageStatistics(): StatsUsage {
		const usage = process.memoryUsage();
		return {
			CPU_LOAD: loadavg() as [number, number, number],
			RAM_TOTAL: `${Math.round(100 * (usage.heapTotal / 1048576)) / 100}MB`,
			RAM_USED: `${Math.round(100 * (usage.heapUsed / 1048576)) / 100}MB`
		};
	}

}

export interface StatsGeneral {
	CHANNELS: string;
	GUILDS: string;
	NODE_JS: string;
	USERS: string;
	VERSION: string;
}

export interface StatsUptime {
	CLIENT: number;
	HOST: number;
	TOTAL: number;
}

export interface StatsUsage {
	CPU_LOAD: [number, number, number];
	RAM_TOTAL: string;
	RAM_USED: string;
}
