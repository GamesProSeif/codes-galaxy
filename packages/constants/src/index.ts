import { stripIndents } from 'common-tags';
import { Message } from 'discord.js';
import { ClientSocket, ServerSocket, NodeMessage } from 'veza';

export const MESSAGES = {
	COMMAND_HANDLER: {
		PROMPT: {
			CANCEL: 'Command has been cancelled.',
			ENDED: 'Too many retries, command has been cancelled.',
			MODIFY_RETRY: (message: Message, text: string) =>
				`${message.member}, ${text}\n\nType \`cancel\` to cancel this command.`,
			MODIFY_START: (message: Message, text: string) =>
				`${message.member}, ${text}\n\nType \`cancel\` to cancel this command.`,
			TIMEOUT: 'Time ran out, command has been cancelled.'
		},
		LOADED: 'Command handler loaded'
	},
	INHIBITOR_HANDLER: {
		LOADED: 'Inhibitor handler loaded'
	},
	LISTENER_HANDLER: {
		LOADED: 'Listener handler loaded'
	},
	CLIENT: {
		INIT: 'Initialising Akairo client'
	},
	COMMANDS: {
		UTIL: {
			EVAL: {
				DESCRIPTION: 'You can\'t access this command anyways',
				PROMPT: {
					START: 'What is the code you want to evaluate?',
					RETRY: 'That is not valid code! Try again'
				}
			},
			HELP: {
				DESCRIPTION: 'Displays information about a command',
				REPLY: (prefix: string) =>
					stripIndents`
					A list of available commands.
					For additional info on a command, type \`${prefix}help <command>\`
					<> mean required, [] mean optional
					`,
				NO_DESCRIPTION: 'No description provided',
				FOOTER: (modulesCount: number) => `${modulesCount} Modules`
			},
			PING: {
				DESCRIPTION: 'Displays response time'
			}
		}
	},
	LISTENERS: {
		CLIENT: {
			READY: {
				LOG: (username: string) => `${username} launched...`
			}
		}
	},
	SERVER: {
		MIDDLEWARES: {
			LOADED: (name: string) => `Loaded ${name} middleware`,
			ALL: 'Loaded all pre middlewares'
		},
		HANDLER: {
			ROUTE_LOADED: (id: string) => `Loaded route: ${id}`,
			LOADED: (methodsCount: number, endpointsCount: number) =>
				`Loaded ${methodsCount} routes with ${endpointsCount} endpoints`
		},
		LISTENING: (port: number) => `Server listening on http://localhost:${port}`
	},
	DB: {
		CONNECTED: 'Connected to DB'
	},
	IPC: {
		CLIENT: {
			CONNECT: (client: ClientSocket) => `Connected to ${client.name}`,
			CONNECTING: (port: number) => `Connecting to port ${port}`,
			DISCONNECT: (client: ClientSocket) => `Disconnected from ${client.name}`,
			NO_CONNECTION: (port: number) => `Cannot connect to IPC server on port ${port}. Exiting...`,
			READY: (client: ClientSocket) => `Connection to server ${client.name} ready`
		},
		SERVER: {
			OPEN: (port: string | number) => `IPC server opened on port ${port}`,
			CLOSE: 'IPC server closed',
			CONNECT: (client: ServerSocket) => `Client ${client.name} connected`,
			DISCONNECT: (client: ServerSocket) => `Client ${client.name} disconnected`,
			MESSAGE: ({ data }: NodeMessage, client: ServerSocket) => `Received message from ${client.name}: ${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}`
		}
	},
	ROUTES: {
		CODE_GET: {
			NOT_FOUND: 'No codes in database'
		},
		CODE_ID_GET: {
			NOT_FOUND: 'Code not found'
		},
		CODE_ID_DELETE: {
			NOT_FOUND: 'Code not found'
		}
	}
};

export const ERRORS = {
	SERVER: {
		ROUTE_ALREADY_LOADED: (id: string) => `Already loaded route ${id}`,
		HANDLER_ERROR: 'Something went wrong'
	},
	ROUTES: {
		CODE_POST: {
			MISSING_DATA: 'Missing body data'
		}
	}
};

export enum COLORS {
	PRIMARY = 0x2ecc71,
	SECONDARY = 0x8e44ad,
	INFO = 0x0891eb,
	WARNING = 0xf1c40e,
	ERROR = 0xe74c3c
}

export enum IPC_TYPE {
	CLIENT,
	GUILD,
	USER,
	MEMBER,
	ROLE
}

export enum TOPICS {
	DISCORD = 'DISCORD',
	DISCORD_AKAIRO = 'DISCORD_AKAIRO',
	EXPRESS = 'EXPRESS',
	EXPRESS_HANDLER = 'EXPRESS_HANDLER',
	IPC = 'IPC',
	TYPEORM = 'TYPEORM',
	MAIN = 'MAIN',
	NUXT = 'NUXT',
	UNHANDLED_REJECTION = 'UNHANDLED_REJECTION'
}

export enum EVENTS {
	CODE_DELETE = 'CODE_DELETE',
	CODE_NEW = 'CODE_NEW',
	COMMAND_BLOCKED = 'COMMAND_BLOCKED',
	COMMAND_CANCELLED = 'COMMAND_CANCELLED',
	COMMAND_FINISHED = 'COMMAND_FINISHED',
	COMMAND_STARTED = 'COMMAND_STARTED',
	DEBUG = 'DEBUG',
	ENDPOINT_HIT = 'ENDPOINT_HIT',
	ERROR = 'ERROR',
	INIT = 'INIT',
	IPC_CLOSE = 'IPC_CLOSE',
	IPC_CONNECT = 'IPC_CONNECT',
	IPC_CONNECTING = 'IPC_CONNECTING',
	IPC_DISCONNECT = 'IPC_DISCONNECT',
	IPC_MESSAGE = 'IPC_MESSAGE',
	IPC_OPEN = 'IPC_OPEN',
	IPC_READY = 'IPC_READY',
	READY = 'READY',
	WARN = 'WARN',
}
