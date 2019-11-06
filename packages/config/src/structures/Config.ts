import { validate } from '../util';

export interface DiscordConfig {
	clientSecret: string;
	clientId: string;
	ownerId: string[];
	serverId: string;
	token: string;
}

export interface ServerConfig {
	port: number;
}

export interface DashboardConfig {
	port: number;
	host: string;
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
				clientId: process.env.CLIENT_ID || '',
				clientSecret: process.env.CLIENT_SECRET || '',
				ownerId: ['252829167320694784', '348143440405725184'],
				serverId: '530859416019533834',
				token: process.env.DISCORD_TOKEN || ''
			},
			{ required: ['token', 'clientId', 'clientSecret'] }
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
				brand: 'Codes',
				host: process.env.DASHBOARD_HOST || '0.0.0.0'
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
