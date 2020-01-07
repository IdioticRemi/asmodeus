import { Command, RichDisplay, util, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';
import { AsmodeusClient } from '@shard/client';

module.exports = class extends Command {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['commands'],
			guarded: true,
			description: language => language.get('COMMAND_HELP_DESCRIPTION'),
			usage: '(Command:command)'
		});

		this.createCustomResolver('command', (arg, possible, message) => {
			if (!arg || arg === '') return undefined;
			// @ts-ignore
			return this.client.arguments.get('command').run(arg, possible, message);
		});
	}

	// @ts-ignore
	public async run(message: KlasaMessage, [command]: [Command]) {
		if (command) {
			const cmd = new MessageEmbed()
				// @ts-ignore
				.setAuthor(`${message.language.get('COMMAND_HELP_CMD', command.name)}`, message.author.avatarURL())
				.setColor((this.client as AsmodeusClient).accent)
				.setDescription(util.isFunction(command.description) ? command.description(message.language) : command.description)
				.addField(message.language.get('COMMAND_HELP_USAGE'), `\`\`\`${command.usage.fullUsage(message)}\`\`\``)
				.addField(message.language.get('COMMAND_HELP_EXTENDED'), (util.isFunction(command.extendedHelp) ? command.extendedHelp(message.language) : command.extendedHelp).toString().substring(0, 1023))
				.setFooter(message.language.get('COMMAND_HELP_REQUESTED', message.author.tag))
				.setTimestamp();

			return message.sendMessage(cmd);
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

		await display.run(message, { filter: (reaction, user) => user.id === message.author.id });
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

};
