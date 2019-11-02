import {
	AkairoClient,
	CommandHandler,
	InhibitorHandler,
	ListenerHandler
} from 'discord-akairo';
import { join } from 'path';
import { Logger } from 'winston';
import { logger, EVENTS, TOPICS } from '../../util/logger';
import { MESSAGES } from '../../util/constants';

declare module 'discord-akairo' {
	interface AkairoClient {
		logger: Logger;
	}
}

const commandsPath = join(__dirname, '..', 'commands/');
const inhibitorsPath = join(__dirname, '..', 'inhibitors/');
const listenersPath = join(__dirname, '..', 'listeners/');

export default class CodesClient extends AkairoClient {
	public logger = logger;

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

	public constructor(ownerID: string | string[]) {
		super({ ownerID });
	}

	public async start(token: string) {
		this._init();
		return this.login(token);
	}

	private _init() {
		this.logger.info(MESSAGES.CLIENT.INIT, { topic: TOPICS.DISCORD, event: EVENTS.INIT });
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
