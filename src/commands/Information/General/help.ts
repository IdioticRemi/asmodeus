import { Command, RichDisplay, util, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed, Permissions, TextChannel } from 'discord.js';
import { AsmodeusClient } from '@shard/client';

const PERMISSIONS_EMBED = new Permissions([Permissions.FLAGS.EMBED_LINKS]);
const PERMISSIONS_RICHDISPLAY = new Permissions([Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.MANAGE_MESSAGES]);

module.exports = class extends Command {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['commands'],
			runIn: ['text'],
			guarded: true,
			requiredPermissions: PERMISSIONS_EMBED,
			description: language => language.get('COMMAND_HELP_DESCRIPTION'),
			usage: '(Command:command|Page:integer|Category:category)'
		});

		this.createCustomResolver('command', (arg, possible, message) => {
			if (!arg || arg === '') return undefined;

			return this.client.arguments.get('command')!.run(arg, possible, message);
		});

		this.createCustomResolver('category', async (arg, _, message) => {
			if (!arg) return undefined;
			arg = arg.toLowerCase();
			let p = 0;

			Object.keys(await this.buildHelp(message)).forEach((category, page) => {
				// Add 1, since 1 will be subtracted later
				if (category.toLowerCase() === arg) p = page + 1;
			});

			return p || undefined;
		});
	}

	// @ts-ignore
	public async run(message: KlasaMessage, [commandOrPage]: [Command | number | undefined]) {
		const command = typeof commandOrPage === 'object' ? commandOrPage : null;
		if (command) {
			const cmd = new MessageEmbed()
				.setAuthor(`${message.language.get('COMMAND_HELP_CMD', command.name)}`, message.author.avatarURL() as string | undefined)
				.setColor((this.client as AsmodeusClient).accent)
				.setDescription(util.isFunction(command.description) ? command.description(message.language) : command.description)
				.addField(message.language.get('COMMAND_HELP_USAGE'), `\`\`\`${command.usage.fullUsage(message)}\`\`\``)
				.addField(message.language.get('COMMAND_HELP_EXTENDED'), (util.isFunction(command.extendedHelp) ? command.extendedHelp(message.language) : command.extendedHelp).toString().substring(0, 1023))
				.setFooter(message.language.get('COMMAND_HELP_REQUESTED', message.author.tag))
				.setTimestamp();

			return message.sendMessage(cmd);
		}

		if (!(message.channel as TextChannel).permissionsFor(this.client.user!)!.has(PERMISSIONS_RICHDISPLAY)) {
			const missing = (message.channel as TextChannel).permissionsFor(this.client.user!)!.missing(PERMISSIONS_RICHDISPLAY, false);

			return message.sendLocale('INHIBITOR_MISSING_BOT_PERMS', [missing.map(key => this.friendlyPerm(key)).join(', ')]);
		}

		const template = new MessageEmbed()
			.setColor((this.client as AsmodeusClient).accent)
			.setFooter(message.language.get('COMMAND_HELP_REQUESTED', message.author.tag))
			.setTitle(message.language.get('COMMAND_HELP_INFO'))
			.setTimestamp();

		const display = new RichDisplay(template)
			.setFooterPrefix(`${message.language.get('COMMAND_HELP_REQUESTED', message.author.tag)} (`)
			.setFooterSuffix(')');

		const help = await this.buildHelp(message);
		const categories = Object.keys(help);

		categories.forEach(cat => {
			// @ts-ignore
			const subCategories = Object.keys(help[cat]);

			display.addPage((template: MessageEmbed) => {
				template.setTitle(message.language.get('COMMAND_HELP_CATEGORY', cat));

				let text = '';
				subCategories.forEach(subCat => {
					// @ts-ignore
					text += `\n[››](http://a.a/) ${subCat}\n\n${help[cat][subCat].join(' | ')}\n`;
				});

				template.setDescription(text);
				return template;
			});
		});

		const page = util.isNumber(commandOrPage) ? commandOrPage - 1 : null;
		const startPage = page === null || page < 0 || page >= display.pages.length ? null : page;

		await display.run(message, { filter: (reaction, user) => user.id === message.author.id, startPage: startPage === null ? undefined : startPage });
	}

	private async buildHelp(message: KlasaMessage) {
		const help = {};

		await Promise.all(this.client.commands.map(command =>
			this.client.inhibitors.run(message, command, true)
				.then(() => {
					// @ts-ignore
					if (!help.hasOwnProperty(command.category)) help[command.category] = {};
					// @ts-ignore
					if (!help[command.category].hasOwnProperty(command.subCategory)) help[command.category][command.subCategory] = [];
					// @ts-ignore
					help[command.category][command.subCategory].push(`\`${command.name}\``);
				})
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				.catch(() => {})));

		return help;
	}

	private friendlyPerm(FLAG: string) {
		const obj = util.toTitleCase(FLAG.split('_').join(' '));
		return obj;
	}

};
