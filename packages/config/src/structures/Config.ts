import { validate } from '../util';

export interface DiscordConfig {
	ownerId: string[];
	token: string;
	serverId: string;
}

export interface ServerConfig {
	port: number;
}

export interface DashboardConfig {
	port: number;
	brand: string;
}

export interface IpcConfig {
	port: number;
}

export interface DbConfig {
	uri: string;
}

export class Config {
	public discord: DiscordConfig;
	public server: ServerConfig;
	public dashboard: DashboardConfig;
	public ipc: IpcConfig;
	public db: DbConfig;

	public constructor(data: any = {}) {
		this.discord = validate<DiscordConfig>(
			'discord',
			data.discord,
			{
				ownerId: ['252829167320694784', '348143440405725184'],
				token: process.env.DISCORD_TOKEN!,
				serverId: '530859416019533834'
			},
			{ required: ['token'] }
		);

		this.server = validate<ServerConfig>(
			'server',
			data.server,
			{
				port: parseInt(process.env.SERVER_PORT || '5000', 10)
			}
		);

		this.dashboard = validate<DashboardConfig>(
			'dashboard',
			data.dashboard,
			{
				port: parseInt(process.env.DASHBOARD_PORT || '3000', 10),
				brand: 'Codes'
			}
		);

		this.ipc = validate<IpcConfig>(
			'ipc',
			data.ipc,
			{
				port: parseInt(process.env.IPC_PORT || '8000', 10)
			}
		);

		this.db = validate<DbConfig>(
			'db',
			data.db,
			{
				uri: process.env.DB_URI!
			},
			{ required: ['uri'] }
		);
	}
}
