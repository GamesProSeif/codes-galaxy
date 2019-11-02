import { Listener } from 'discord-akairo';
import { EVENTS, TOPICS } from '../../../util/logger';
import { MESSAGES } from '../../../util/constants';

export default class Ready extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			category: 'client'
		});
	}

	public async exec() {
		await this.client.user!.setActivity(`@${this.client.user!.tag} help`);
		this.client.logger.info(MESSAGES.LISTENERS.CLIENT.READY.LOG(this.client.user!.username), {
			topic: TOPICS.DISCORD,
			event: EVENTS.READY
		});
	}
}
