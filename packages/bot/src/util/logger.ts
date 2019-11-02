import { join } from 'path';
import { createLogger, format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export enum TOPICS {
	DISCORD = 'DISCORD',
	DISCORD_AKAIRO = 'DISCORD_AKAIRO',
	UNHANDLED_REJECTION = 'UNHANDLED_REJECTION'
}

export enum EVENTS {
	ERROR = 'ERROR',
	DEBUG = 'DEBUG',
	COMMAND_BLOCKED = 'COMMAND_BLOCKED',
	COMMAND_CANCELLED = 'COMMAND_CANCELLED',
	COMMAND_FINISHED = 'COMMAND_FINISHED',
	COMMAND_STARTED = 'COMMAND_STARTED',
	INIT = 'INIT',
	READY = 'READY',
	WARN = 'WARN',
}
export const logger = createLogger({
	format: format.combine(
		format.errors({ stack: true }),
		format.label({ label: 'BOT' }),
		format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
		format.printf((info: any): string => {
			const { timestamp, label, level, message, topic, event, ...rest } = info;
			return `[${timestamp}][${label}][${level.toUpperCase()}][${topic}]${event ? `[${event}]` : ''}: ${message}${Object.keys(rest).length ? `\n${JSON.stringify(rest, null, 2)}` : ''}`;
		})
	),
	transports: [
		new transports.Console({
			format: format.colorize({ level: true }),
			level: 'info'
		}),
		new DailyRotateFile({
			format: format.combine(format.timestamp(), format.json()),
			level: 'debug',
			filename: 'codes-%DATE%.log',
			maxFiles: '14d',
			dirname: join(process.cwd(), '..', '..', 'logs')
		})
	]
});
