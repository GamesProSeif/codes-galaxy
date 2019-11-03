import { Listener } from 'discord-akairo';
import { EVENTS, TOPICS } from '../../util/logger';
import { IPC_TYPE, MESSAGES } from '../../util/constants';
import { NodeMessage, ServerSocket } from 'veza';

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

		this.client.ipc.on('message', async (message: NodeMessage, client: ServerSocket) => {
			this.client.logger.info(MESSAGES.IPC.MESSAGE(message, client), { topic: TOPICS.IPC, event: EVENTS.IPC_MESSAGE });

			try {
				let res;
				let tmp;
				switch (message.data.type) {
					case IPC_TYPE.CLIENT:
						res = this.client.toJSON();
						message.reply(res);
						break;
					case IPC_TYPE.GUILD:
						res = this.client.guilds.get(message.data.type.guild_id);
						message.reply(res ? res.toJSON() : undefined);
						break;
					case IPC_TYPE.USER:
						res = this.client.users.get(message.data.user_id);
						if (!res) {
							res = await this.client.users.fetch(message.data.id);
						}
						message.reply(res ? res.toJSON() : undefined);
						break;
					case IPC_TYPE.MEMBER:
						tmp = this.client.guilds.get(message.data.guild_id);
						if (!tmp) {
							message.reply(undefined);
							break;
						}
						res = tmp.members.get(message.data.member_id);
						if (!res) {
							res = await tmp.members.fetch(message.data.member_id);
						}
						message.reply(res ? res.toJSON() : undefined);
						break;
					case IPC_TYPE.ROLE:
						tmp = this.client.guilds.get(message.data.guild_id);
						if (!tmp) {
							message.reply(undefined);
							break;
						}
						res = tmp.roles.get(message.data.role_id);
						message.reply(res ? res.toJSON() : undefined);
						break;
					default:
						message.reply(undefined);
						break;
				}
			} catch (error) {
				message.reply(undefined);
				this.client.logger.error(error as string, { topic: TOPICS.DISCORD, event: EVENTS.IPC_MESSAGE });
			}
		});
	}
}
