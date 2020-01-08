import { Extendable, ExtendableStore, ReactionHandler } from 'klasa';
import { TextChannel, Permissions } from 'discord.js';

const PERMISSIONS_RICHDISPLAY = new Permissions([Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.MANAGE_MESSAGES]);

export default class extends Extendable {

	public constructor(store: ExtendableStore, file: string[], dir: string) {
		super(store, file, dir, { appliesTo: [ReactionHandler] });
	}

	// @ts-ignore
	private async _queueEmojiReactions(emojis) {
		if ((this as unknown as ReactionHandler).message.deleted) return (this as unknown as ReactionHandler).stop();
		if (!((this as unknown as ReactionHandler).message.channel as TextChannel).permissionsFor(this.client.user!)!.has(PERMISSIONS_RICHDISPLAY)) return (this as unknown as ReactionHandler).reactionsDone = true;
		if ((this as unknown as ReactionHandler).ended) return (this as unknown as ReactionHandler).message.reactions.removeAll().catch(() => emojis = [] && (this as unknown as ReactionHandler).stop());
		await (this as unknown as ReactionHandler).message.react(emojis.shift()).catch(() => (this as unknown as ReactionHandler).stop());
		if (emojis.length) return this._queueEmojiReactions(emojis);
		(this as unknown as ReactionHandler).reactionsDone = true;
		return null;
	}

}
