import { Inhibitor } from 'discord-akairo';
import { Message } from 'discord.js';

class BlacklistInhibitor extends Inhibitor {
	constructor() {
		super('blacklist', {
			reason: 'blacklist'
		});
	}

	public exec(message: Message) {
		const blacklist: string[] = [];
		return blacklist.includes(message.author!.id);
	}
}

module.exports = BlacklistInhibitor;
