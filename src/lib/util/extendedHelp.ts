import { configEnv } from './configEnv';
import { AsmodeusConfig } from '../typings';
import { Style } from '@enum/style';

const config: AsmodeusConfig = configEnv();

export class ExtendedHelp {

	private extendedHelp: string | null = null;
	private explainedUsage: string | null = null;
	private possibleFormats: string | null = null;
	private examples: string | null = null;

	public setExtendedHelp(text: string) {
		this.extendedHelp = text;
		return this;
	}

	public setExplainedUsage(text: string) {
		this.explainedUsage = text;
		return this;
	}

	public setPossibleFormats(text: string) {
		this.possibleFormats = text;
		return this;
	}

	public setExamples(text: string) {
		this.examples = text;
		return this;
	}

	public display(name: string, options: ExtendedHelpDisplayOptions) {
		const { extendedHelp, explainedUsage = [], possibleFormats = [], examples = [] } = options;
		const output = {
			extendedHelp: [] as Array<string>,
			explainedUsage: [] as Array<string>,
			possibleFormats: [] as Array<string>,
			examples: [] as Array<string>
		};

		// Extended help
		if (extendedHelp && this.extendedHelp) {
			output.extendedHelp.push(this.extendedHelp!, extendedHelp);
		}

		// Explained usage
		if (explainedUsage.length && this.explainedUsage) {
			output.explainedUsage.push(this.explainedUsage!, explainedUsage.map(([arg, desc]) => `${Style.EmbedArrow} **${arg}**: ${desc}`).join('\n'));
		}

		// Possible formats
		if (possibleFormats.length && this.possibleFormats) {
			output.possibleFormats.push(this.possibleFormats!, possibleFormats.map(([type, example]) => `${Style.EmbedArrow} **${type}**: ${example}`).join('\n'));
		}

		// Examples
		if (examples.length && this.examples) {
			output.examples.push(this.examples!, examples.map(example => `${Style.EmbedArrow} ${config.CLIENT_OPTIONS.prefix![0]!} ${name}${example ? ` *${example}*` : ''}`).join('\n'));
		} else {
			output.examples.push(this.examples!, `${Style.EmbedArrow} ${config.CLIENT_OPTIONS.prefix![0]!} ${name}`);
		}

		return output;
	}

}

export interface ExtendedHelpOutput {
	extendedHelp: Array<string>;
	explainedUsage: Array<string>;
	possibleFormats: Array<string>;
	examples: Array<string>;
}

interface ExtendedHelpDisplayOptions {
	extendedHelp?: string;
	explainedUsage?: Array<[string, string]>;
	possibleFormats?: Array<[string, string]>;
	examples?: string[];
	reminder?: string[] | string;
}
