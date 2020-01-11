import { T } from './Shared';
import { Command } from 'klasa';

/* eslint-disable @typescript-eslint/no-namespace */

export namespace GuildSchema {
	export const Prefix = T<string>('prefix');
	export const Language = T<string>('language');
	export const DisableNaturalPrefix = T<boolean>('disableNaturalPrefix');
	export const DisabledCommands = T<Array<Command>>('disabledCommands');
	export const Premium = T<boolean>('premium');

	export namespace Roles {
		export const Moderator = T<string>('roles.moderator');
		export const Admin = T<string>('roles.admin');
	}
}
