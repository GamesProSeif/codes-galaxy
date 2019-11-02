import { stripIndents } from 'common-tags';
import { Message } from 'discord.js';

export enum COLORS {
	PRIMARY = 0x2ecc71,
	SECONDARY = 0x8e44ad,
	INFO = 0x0891eb,
	WARNING = 0xf1c40e,
	ERROR = 0xe74c3c
}

export const MESSAGES = {
	MAIN: {
		INIT: 'Starting app'
	},
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
	DB: {
		CONNECTED: 'Connected to DB'
	}
};

export const ERRORS = {
	SERVER: {
		ROUTE_ALREADY_LOADED: (id: string) => `Already loaded route ${id}`,
		HANDLER_ERROR: 'Something went wrong'
	}
};
