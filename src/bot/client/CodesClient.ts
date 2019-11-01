import {
	AkairoClient,
	CommandHandler,
	InhibitorHandler,
	ListenerHandler
} from 'discord-akairo';
import { join } from 'path';
import { logger, EVENTS, TOPICS } from '../../util/logger';
import { Logger } from 'winston';

declare module 'discord-akairo' {
	interface AkairoClient {
		colors: {
			primary: number;
			secondary: number;
			info: number;
			warning: number;
			error: number;
		};
		logger: Logger;
	}
}

const commandsPath = join(__dirname, '..', 'commands/');
const inhibitorsPath = join(__dirname, '..', 'inhibitors/');
const listenersPath = join(__dirname, '..', 'listeners/');

export default class GopnikClient extends AkairoClient {
	public logger = logger;

	public colors = {
		primary: 0x2ecc71,
		secondary: 0x8e44ad,
		info: 0x0891eb,
		warning: 0xf1c40e,
		error: 0xe74c3c
	};

	public commandHandler: CommandHandler = new CommandHandler(this, {
		aliasReplacement: /-/g,
		allowMention: true,
		argumentDefaults: {
			prompt: {
				cancel: 'Command has been cancelled.',
				ended: 'Too many retries, command has been cancelled.',
				modifyRetry: (message, text) =>
					`${message.member}, ${text}\n\nType \`cancel\` to cancel this command.`,
				modifyStart: (message, text) =>
					`${message.member}, ${text}\n\nType \`cancel\` to cancel this command.`,
				retries: 3,
				time: 30000,
				timeout: 'Time ran out, command has been cancelled.'
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
		this.logger.info('Initialising Discord client', { topic: TOPICS.DISCORD, event: EVENTS.INIT });
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.commandHandler.useListenerHandler(this.listenerHandler);

		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			inhibitorHandler: this.inhibitorHandler,
			listenerHandler: this.listenerHandler,
			process
		});

		this.commandHandler.loadAll();
		this.logger.info('Command handler loaded', { topic: TOPICS.DISCORD_AKAIRO, event: EVENTS.INIT });
		this.inhibitorHandler.loadAll();
		this.logger.info('Inhibitor handler loaded', { topic: TOPICS.DISCORD_AKAIRO, event: EVENTS.INIT });
		this.listenerHandler.loadAll();
		this.logger.info('Listener handler loaded', { topic: TOPICS.DISCORD_AKAIRO, event: EVENTS.INIT });
	}
}
