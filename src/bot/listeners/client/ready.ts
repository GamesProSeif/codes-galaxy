import { Listener } from 'discord-akairo';
import { EVENTS, TOPICS } from '../../../util/logger';

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
		this.client.logger.info(`${this.client.user!.username} launched...`, {
			topic: TOPICS.DISCORD,
			event: EVENTS.READY
		});
	}
}
