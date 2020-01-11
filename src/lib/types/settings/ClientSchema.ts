import { T } from './Shared';
import { KlasaUser, KlasaGuild } from 'klasa';

/* eslint-disable @typescript-eslint/no-namespace */

export namespace ClientSchema {
	export const UserBlacklist = T<Array<KlasaUser>>('userBlacklist');
	export const GuildBlacklist = T<Array<KlasaGuild>>('guildBlacklist');
	export const Schedules = T<Array<any>>('schedules');
}
