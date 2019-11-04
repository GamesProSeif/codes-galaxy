import { Config } from '@codes/config';
import { Connection, Database } from '@codes/models';
import {
	AkairoClient,
	CommandHandler,
	InhibitorHandler,
	ListenerHandler
} from 'discord-akairo';
import { join } from 'path';
import { Server } from 'veza';
import { logger, Logger } from '@codes/util';
import { EVENTS, MESSAGES, TOPICS } from '@codes/constants';

declare module 'discord-akairo' {
	interface AkairoClient {
		commandHandler: CommandHandler;
		listenerHandler: ListenerHandler;
		inhibitorHandler: InhibitorHandler;
		config: Config;
		db: Connection;
		logger: Logger;
		ipc: Server;
	}
}

const commandsPath = join(__dirname, '..', 'commands/');
const inhibitorsPath = join(__dirname, '..', 'inhibitors/');
const listenersPath = join(__dirname, '..', 'listeners/');

export default class CodesClient extends AkairoClient {
	public logger = logger('bot');
	public db = Database;
	public ipc = new Server('bot');

	public commandHandler: CommandHandler = new CommandHandler(this, {
		aliasReplacement: /-/g,
		allowMention: true,
		argumentDefaults: {
			prompt: {
				cancel: MESSAGES.COMMAND_HANDLER.PROMPT.CANCEL,
				ended: MESSAGES.COMMAND_HANDLER.PROMPT.ENDED,
				modifyStart: MESSAGES.COMMAND_HANDLER.PROMPT.MODIFY_START,
				modifyRetry: MESSAGES.COMMAND_HANDLER.PROMPT.MODIFY_RETRY,
				retries: 3,
				time: 30000,
				timeout: MESSAGES.COMMAND_HANDLER.PROMPT.TIMEOUT
			}
		},
		commandUtil: true,
		commandUtilLifetime: 600000,
		defaultCooldown: 3000,
		directory: commandsPath,
		handleEdits: true,
		prefix: '-',
		storeMessages: true
	});

	public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
		directory: inhibitorsPath
	});

	public listenerHandler: ListenerHandler = new ListenerHandler(this, {
		directory: listenersPath
	});

	public constructor(config: Config) {
		super({ ownerID: config.discord.ownerId });

		process.on('unhandledRejection', err => {
			this.logger.error(err as string, { topic: TOPICS.UNHANDLED_REJECTION, event: EVENTS.ERROR });
		});

		this.config = config;

		this.ipc
			.on('open', () => this.logger.info(MESSAGES.IPC.SERVER.OPEN(process.env.IPC_PORT || 8000), { topic: TOPICS.IPC, event: EVENTS.IPC_OPEN }))
			.on('close', () => this.logger.info(MESSAGES.IPC.SERVER.CLOSE, { topic: TOPICS.IPC, event: EVENTS.IPC_CLOSE }))
			.on('error', err =>
				this.logger.error(JSON.stringify(err, null, 2), { topic: TOPICS.IPC, event: EVENTS.ERROR }))
			.on('connect', client => this.logger.info(MESSAGES.IPC.SERVER.CONNECT(client), { topic: TOPICS.IPC, event: EVENTS.IPC_CONNECT }))
			.on('disconnect', client => this.logger.info(MESSAGES.IPC.SERVER.DISCONNECT(client), { topic: TOPICS.IPC, event: EVENTS.IPC_DISCONNECT }));
	}

	public async start() {
		await this._init();
		return this.login(this.config.discord.token);
	}

	private async _init() {
		this.logger.info(MESSAGES.CLIENT.INIT, { topic: TOPICS.DISCORD, event: EVENTS.INIT });

		await this.ipc.listen(this.config.ipc.port);

		await this.db.connect();
		this.logger.info(MESSAGES.DB.CONNECTED, { topic: TOPICS.TYPEORM, event: EVENTS.INIT });

		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.commandHandler.useListenerHandler(this.listenerHandler);

		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			inhibitorHandler: this.inhibitorHandler,
			listenerHandler: this.listenerHandler,
			process
		});

		this.commandHandler.loadAll();
		this.logger.info(MESSAGES.COMMAND_HANDLER.LOADED, { topic: TOPICS.DISCORD_AKAIRO, event: EVENTS.INIT });
		this.inhibitorHandler.loadAll();
		this.logger.info(MESSAGES.INHIBITOR_HANDLER.LOADED, { topic: TOPICS.DISCORD_AKAIRO, event: EVENTS.INIT });
		this.listenerHandler.loadAll();
		this.logger.info(MESSAGES.LISTENER_HANDLER.LOADED, { topic: TOPICS.DISCORD_AKAIRO, event: EVENTS.INIT });
	}
}
