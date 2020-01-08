import { LanguageStore, Language, util, version } from 'klasa';
import { MessageEmbed } from 'discord.js';
import { AsmodeusClient } from '@shard/client';
import friendlyDuration from '@utils/friendlyDuration';
import { Style } from '@enum/style';

const TIMES = {
	YEAR: {
		1: 'year',
		DEFAULT: 'years'
	},
	MONTH: {
		1: 'month',
		DEFAULT: 'months'
	},
	WEEK: {
		1: 'week',
		DEFAULT: 'weeks'
	},
	DAY: {
		1: 'day',
		DEFAULT: 'days'
	},
	HOUR: {
		1: 'hour',
		DEFAULT: 'hours'
	},
	MINUTE: {
		1: 'minute',
		DEFAULT: 'minutes'
	},
	SECOND: {
		1: 'second',
		DEFAULT: 'seconds'
	}
};

function duration(time: number, precision?: number) {
	return friendlyDuration(time, TIMES, precision);
}

module.exports = class extends Language {

	public constructor(store: LanguageStore, file: string[], directory: string) {
		super(store, file, directory);
		this.language = {
			DEFAULT: key => `${key} has not been localized for 'en' yet.`,
			DEFAULT_LANGUAGE: 'Default Language',

			PREFIX_REMINDER: (prefix = `@${this.client.user?.tag}`) => `The prefix${Array.isArray(prefix)
				? `es for this guild are: ${prefix.map(pre => `\`${pre}\``).join(', ')}`
				: ` in this guild is set to: \`${prefix}\``
			}`,

			SETTING_GATEWAY_EXPECTS_GUILD: 'The parameter <Guild> expects either a Guild or a Guild Object.',
			SETTING_GATEWAY_VALUE_FOR_KEY_NOEXT: (data, key) => `The value ${data} for the key ${key} does not exist.`,
			SETTING_GATEWAY_VALUE_FOR_KEY_ALREXT: (data, key) => `The value ${data} for the key ${key} already exists.`,
			SETTING_GATEWAY_SPECIFY_VALUE: 'You must specify the value to add or filter.',
			SETTING_GATEWAY_KEY_NOT_ARRAY: key => `The key ${key} is not an Array.`,
			SETTING_GATEWAY_KEY_NOEXT: key => `The key ${key} does not exist in the current data schema.`,
			SETTING_GATEWAY_INVALID_TYPE: 'The type parameter must be either add or remove.',
			SETTING_GATEWAY_INVALID_FILTERED_VALUE: (piece, value) => `${piece.key} doesn't accept the value: ${value}`,

			RESOLVER_MULTI_TOO_FEW: (name, min = 1) => `Provided too few ${name}s. At least ${min} ${min === 1 ? 'is' : 'are'} required.`,
			RESOLVER_INVALID_BOOL: name => `${name} must be true or false.`,
			RESOLVER_INVALID_CHANNEL: name => `${name} must be a channel tag or valid channel id.`,
			RESOLVER_INVALID_CUSTOM: (name, type) => `${name} must be a valid ${type}.`,
			RESOLVER_INVALID_DATE: name => `${name} must be a valid date.`,
			RESOLVER_INVALID_DURATION: name => `${name} must be a valid duration string.`,
			RESOLVER_INVALID_EMOJI: name => `${name} must be a custom emoji tag or valid emoji id.`,
			RESOLVER_INVALID_FLOAT: name => `${name} must be a valid number.`,
			RESOLVER_INVALID_GUILD: name => `${name} must be a valid guild id.`,
			RESOLVER_INVALID_INT: name => `${name} must be an integer.`,
			RESOLVER_INVALID_LITERAL: name => `Your option did not match the only possibility: ${name}`,
			RESOLVER_INVALID_MEMBER: name => `${name} must be a mention or valid user id.`,
			RESOLVER_INVALID_MESSAGE: name => `${name} must be a valid message id.`,
			RESOLVER_INVALID_PIECE: (name, piece) => `${name} must be a valid ${piece} name.`,
			RESOLVER_INVALID_REGEX_MATCH: (name, pattern) => `${name} must follow this regex pattern \`${pattern}\`.`,
			RESOLVER_INVALID_ROLE: name => `${name} must be a role mention or role id.`,
			RESOLVER_INVALID_STRING: name => `${name} must be a valid string.`,
			RESOLVER_INVALID_TIME: name => `${name} must be a valid duration or date string.`,
			RESOLVER_INVALID_URL: name => `${name} must be a valid url.`,
			RESOLVER_INVALID_USER: name => `${name} must be a mention or valid user id.`,
			RESOLVER_STRING_SUFFIX: ' characters',
			RESOLVER_MINMAX_EXACTLY: (name, min, suffix) => `${name} must be exactly ${min}${suffix}.`,
			RESOLVER_MINMAX_BOTH: (name, min, max, suffix) => `${name} must be between ${min} and ${max}${suffix}.`,
			RESOLVER_MINMAX_MIN: (name, min, suffix) => `${name} must be greater than ${min}${suffix}.`,
			RESOLVER_MINMAX_MAX: (name, max, suffix) => `${name} must be less than ${max}${suffix}.`,

			REACTIONHANDLER_PROMPT: 'Which page would you like to jump to?',

			COMMANDMESSAGE_MISSING: 'Missing one or more required arguments after end of input.',
			COMMANDMESSAGE_MISSING_REQUIRED: name => `${name} is a required argument.`,
			COMMANDMESSAGE_MISSING_OPTIONALS: possibles => `Missing a required option: (${possibles})`,
			COMMANDMESSAGE_NOMATCH: possibles => `Your option didn't match any of the possibilities: (${possibles})`,

			// eslint-disable-next-line max-len
			MONITOR_COMMAND_HANDLER_REPROMPT: (tag, error, time, abortOptions) => `${tag} | **${error}** | You have **${time}** seconds to respond to this prompt with a valid argument. Type **${abortOptions.join('**, **')}** to abort this prompt.`,
			// eslint-disable-next-line max-len
			MONITOR_COMMAND_HANDLER_REPEATING_REPROMPT: (tag, name, time, cancelOptions) => `${tag} | **${name}** is a repeating argument | You have **${time}** seconds to respond to this prompt with additional valid arguments. Type **${cancelOptions.join('**, **')}** to cancel this prompt.`,
			MONITOR_COMMAND_HANDLER_ABORTED: 'Aborted',

			INHIBITOR_COOLDOWN: remaining => `You have just used this command. You can use this command again in ${remaining} second${remaining === 1 ? '' : 's'}.`,
			INHIBITOR_DISABLED_GUILD: 'This command has been disabled by an admin in this guild.',
			INHIBITOR_DISABLED_GLOBAL: 'This command has been globally disabled by the bot owner.',
			INHIBITOR_MISSING_BOT_PERMS: missing => `Insufficient permissions, missing: **${missing}**`,
			INHIBITOR_NSFW: 'You can only use NSFW commands in NSFW channels.',
			INHIBITOR_PERMISSIONS: 'You do not have permission to use this command.',
			INHIBITOR_REQUIRED_SETTINGS: settings => `The guild is missing the **${settings.join(', ')}** guild setting${settings.length > 1 ? 's' : ''} and thus the command cannot run.`,
			INHIBITOR_RUNIN: types => `This command is only available in ${types} channels.`,
			INHIBITOR_RUNIN_NONE: name => `The ${name} command is not configured to run in any channel.`,

			COMMAND_BLACKLIST_DESCRIPTION: 'Blacklists or un-blacklists users and guilds from the bot.',
			COMMAND_BLACKLIST_SUCCESS: (usersAdded, usersRemoved, guildsAdded, guildsRemoved) => [
				usersAdded.length ? `**Users Added**\n${util.codeBlock('', usersAdded.join(', '))}` : '',
				usersRemoved.length ? `**Users Removed**\n${util.codeBlock('', usersRemoved.join(', '))}` : '',
				guildsAdded.length ? `**Guilds Added**\n${util.codeBlock('', guildsAdded.join(', '))}` : '',
				guildsRemoved.length ? `**Guilds Removed**\n${util.codeBlock('', guildsRemoved.join(', '))}` : ''
			].filter(val => val !== '').join('\n'),

			COMMAND_EVAL_ERROR: (time, output, type) => `**Error**:${output}\n**Type**:${type}\n${time}`,
			COMMAND_EVAL_OUTPUT: (time, output, type) => `**Output**:${output}\n**Type**:${type}\n${time}`,
			COMMAND_EVAL_SENDFILE: (time, type) => `Output was too long... sent the result as a file.\n**Type**:${type}\n${time}`,
			COMMAND_EVAL_SENDCONSOLE: (time, type) => `Output was too long... sent the result to console.\n**Type**:${type}\n${time}`,
			COMMAND_EVAL_DESCRIPTION: 'Evaluates arbitrary Javascript. Reserved for bot owner.',
			COMMAND_EVAL_EXTENDEDHELP: [
				'The eval command evaluates code as-in, any error thrown from it will be handled.',
				'It also uses the flags feature. Write --silent, --depth=number or --async to customize the output.',
				'The --silent flag will make it output nothing.',
				"The --depth flag accepts a number, for example, --depth=2, to customize util.inspect's depth.",
				'The --async flag will wrap the code into an async function where you can enjoy the use of await, however, if you want to return something, you will need the return keyword.',
				'The --showHidden flag will enable the showHidden option in util.inspect.',
				'If the output is too large, it\'ll send the output as a file, or in the console if the bot does not have the ATTACH_FILES permission.'
			].join('\n'),

			COMMAND_UNLOAD: (type, name) => `✅ Unloaded ${type}: ${name}`,
			COMMAND_UNLOAD_DESCRIPTION: 'Unloads the klasa piece.',
			COMMAND_UNLOAD_WARN: 'You probably don\'t want to unload that, since you wouldn\'t be able to run any command to enable it again',

			COMMAND_TRANSFER_ERROR: '❌ That file has been transfered already or never existed.',
			COMMAND_TRANSFER_SUCCESS: (type, name) => `✅ Successfully transferred ${type}: ${name}.`,
			COMMAND_TRANSFER_FAILED: (type, name) => `Transfer of ${type}: ${name} to Client has failed. Please check your Console.`,
			COMMAND_TRANSFER_DESCRIPTION: 'Transfers a core piece to its respective folder.',

			COMMAND_RELOAD: (type, name, time) => `✅ Reloaded ${type}: ${name}. (Took: ${time})`,
			COMMAND_RELOAD_FAILED: (type, name) => `❌ Failed to reload ${type}: ${name}. Please check your Console.`,
			COMMAND_RELOAD_ALL: (type, time) => `✅ Reloaded all ${type}. (Took: ${time})`,
			COMMAND_RELOAD_EVERYTHING: time => `✅ Reloaded everything. (Took: ${time})`,
			COMMAND_RELOAD_DESCRIPTION: 'Reloads a klasa piece, or all pieces of a klasa store.',
			COMMAND_REBOOT: 'Rebooting...',
			COMMAND_REBOOT_DESCRIPTION: 'Reboots the bot.',

			COMMAND_LOAD: (time, type, name) => `✅ Successfully loaded ${type}: ${name}. (Took: ${time})`,
			COMMAND_LOAD_FAIL: 'The file does not exist, or an error occurred while loading your file. Please check your console.',
			COMMAND_LOAD_ERROR: (type, name, error) => `❌ Failed to load ${type}: ${name}. Reason:${util.codeBlock('js', error)}`,
			COMMAND_LOAD_DESCRIPTION: 'Load a piece from your bot.',

			COMMAND_PING: 'Ping?',
			COMMAND_PINGPONG: (diff, ping) => `Pong! (Roundtrip took: ${diff}ms. Heartbeat: ${ping}ms.)`,
			COMMAND_PING_DESCRIPTION: 'Runs a connection test to Discord.',

			COMMAND_INVITE: () => [
				`To add ${this.client.user?.username} to your discord guild:`,
				`<${this.client.invite}>`,
				util.codeBlock('', [
					'The above link is generated requesting the minimum permissions required to use every command currently.',
					'I know not all permissions are right for every guild, so don\'t be afraid to uncheck any of the boxes.',
					'If you try to use a command that requires more permissions than the bot is granted, it will let you know.'
				].join(' ')),
				'Please file an issue at <https://github.com/dirigeants/klasa> if you find any bugs.'
			],
			COMMAND_INVITE_DESCRIPTION: 'Displays the invite link of the bot, to invite it to your guild.',

			COMMAND_INFO: [
				"Klasa is a 'plug-and-play' framework built on top of the Discord.js library.",
				'Most of the code is modularized, which allows developers to edit Klasa to suit their needs.',
				'',
				'Some features of Klasa include:',
				'• 🐇💨 Fast loading times with ES2017 support (`async`/`await`)',
				'• 🎚🎛 Per-client/guild/user settings that can be extended with your own fields',
				'• 💬 Customizable command system with automated parameter resolving and the ability to load/reload commands on-the-fly',
				'• 👀 "Monitors", which can watch messages and edits (for swear filters, spam protection, etc.)',
				'• ⛔ "Inhibitors", which can prevent commands from running based on any condition you wish to apply (for permissions, blacklists, etc.)',
				'• 🗄 "Providers", which simplify usage of any database of your choosing',
				'• ✅ "Finalizers", which run after successful commands (for logging, collecting stats, cleaning up responses, etc.)',
				'• ➕ "Extendables", which passively add methods, getters/setters, or static properties to existing Discord.js or Klasa classes',
				'• 🌐 "Languages", which allow you to localize your bot\'s responses',
				'• ⏲ "Tasks", which can be scheduled to run in the future, optionally repeating',
				'',
				'We hope to be a 100% customizable framework that can cater to all audiences. We do frequent updates and bugfixes when available.',
				"If you're interested in us, check us out at https://klasa.js.org"
			],
			COMMAND_INFO_DESCRIPTION: 'Provides some information about this bot.',

			COMMAND_ENABLE: (type, name) => `+ Successfully enabled ${type}: ${name}`,
			COMMAND_ENABLE_DESCRIPTION: 'Re-enables or temporarily enables a command/inhibitor/monitor/finalizer. Default state restored on reboot.',

			COMMAND_DISABLE: (type, name) => `+ Successfully disabled ${type}: ${name}`,
			COMMAND_DISABLE_DESCRIPTION: 'Re-disables or temporarily disables a command/inhibitor/monitor/finalizer/event. Default state restored on reboot.',

			COMMAND_DISABLE_WARN: 'You probably don\'t want to disable that, since you wouldn\'t be able to run any command to enable it again',

			// @ts-ignore
			COMMAND_STATS: (stats, uptime, usage) => new MessageEmbed()
				.setColor((this.client as AsmodeusClient).accent)
				.addField('Statistics', [
					`${Style.EmbedArrow} Users: **${stats.USERS}**`,
					`Guilds: **${stats.GUILDS}**`,
					`Channels: **${stats.CHANNELS}**`,
					`Discord.js: **${stats.VERSION}**`,
					`Node.js: **${stats.NODE_JS}**`,
					`Klasa: **${version}**`
				].join(`\n${Style.EmbedArrow} `))
				.addField('Uptime', [
					`${Style.EmbedArrow} Host: **${duration(uptime.HOST, 2)}**`,
					`Total: **${duration(uptime.TOTAL, 2)}**`,
					`Client: **${duration(uptime.CLIENT, 2)}**`
				].join(`\n${Style.EmbedArrow} `))
				.addField('Server Usage', [
					`${Style.EmbedArrow} CPU Load: **${usage.CPU_LOAD.join('%** | **')}%**`,
					`Heap: **${usage.RAM_USED}** (Total: **${usage.RAM_TOTAL}**)`
				].join(`\n${Style.EmbedArrow} `)),
			COMMAND_STATS_DESCRIPTION: 'Provides some details about the bot and stats.',

			MESSAGE_PROMPT_TIMEOUT: 'The prompt has timed out.',
			TEXT_PROMPT_ABORT_OPTIONS: ['abort', 'stop', 'cancel'],

			// eslint-disable-next-line no-dupe-keys
			COMMAND_HELP_NO_EXTENDED: 'No extended help available.',
			COMMAND_HELP_CMD: name => `Command: ${name}`,
			COMMAND_HELP_CATEGORY: category => `${category} commands`,
			COMMAND_HELP_REQUESTED: tag => `Requested by ${tag}`,
			COMMAND_HELP_LOADING: `:gear: Generating Display...`,
			COMMAND_HELP_USAGE: 'Usage',
			COMMAND_HELP_EXTENDED: 'Extended Help',
			COMMAND_HELP_INFO: 'Information Page',
			COMMAND_HELP_INFOS: 'This is Kuromu\'s information page!\n\nNavigate using the reactions at the bottom!\n*Make sure I have the right permissions*',
			COMMAND_HELP_DESCRIPTION: 'Display help for a command.'
		};
	}

	public async init() {
		await super.init();
	}

};
