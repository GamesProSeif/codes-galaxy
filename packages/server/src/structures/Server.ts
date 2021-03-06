/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Config } from '@codes/config';
import { ERRORS, EVENTS, MESSAGES, TOPICS } from '@codes/constants';
import { Connection, Database } from '@codes/models';
import { logger, readdirRecursive } from '@codes/util';
import { Express, json, urlencoded, RequestHandler } from 'express';
import * as morgan from 'morgan';
import { join, resolve, posix as path } from 'path';
import { Client } from 'veza';
import Route from './Route';

export default class Server {
	public server: Express;
	public config: Config;
	public db!: Connection;
	public path: string;
	public logger = logger('server');
	public ipc = new Client('server', { maximumRetries: 3 });
	public readonly API_METHODS = resolve(join(__dirname, '..', 'api'));
	public readonly DEV = process.env.NODE_ENV === 'development';
	public methods: { [key: string]: Route } = {};
	public endpoints: { [key: string]: string } = {};

	public constructor(server: Express, path: string, config: Config) {
		this.server = server;
		this.path = path;
		this.config = config;

		this.ipc
			.on('connecting', () => this.logger.info(MESSAGES.IPC.CLIENT.CONNECTING(this.config.ipc.port), { topic: TOPICS.IPC, event: EVENTS.IPC_CONNECTING }))
			.on('connect', () => this.logger.info(MESSAGES.IPC.CLIENT.CONNECT(this.config.ipc.port), { topic: TOPICS.IPC, event: EVENTS.IPC_CONNECT }))
			.on('ready', client => this.logger.info(MESSAGES.IPC.CLIENT.READY(client), { topic: TOPICS.IPC, event: EVENTS.IPC_READY }))
			.on('error', err => this.logger.error(JSON.stringify(err, null, 2), { topic: TOPICS.IPC, event: EVENTS.ERROR }))
			.on('disconnect', client => this.logger.info(MESSAGES.IPC.CLIENT.DISCONNECT(client), { topic: TOPICS.IPC, event: EVENTS.IPC_DISCONNECT }));

		if (process.env.NODE_ENV === 'production') {
			this.server.enable('trust proxy');
			// this.server.use((req, res) => {
			// 	if (!req.secure) {
			// 		res.redirect(`https://${req.headers.host}${req.url}`);
			// 	}
			// });
		}
	}

	private setMiddlewares() {
		// Body Parser Middleware
		this.server.use(json());
		this.logger.debug(MESSAGES.SERVER.MIDDLEWARES.LOADED('json'), { topic: TOPICS.EXPRESS, event: EVENTS.INIT });
		this.server.use(urlencoded({ extended: false }));
		this.logger.debug(MESSAGES.SERVER.MIDDLEWARES.LOADED('urlencoded'), { topic: TOPICS.EXPRESS, event: EVENTS.INIT });

		this.server.use(
			morgan(
				':method :url :status :remote-addr :response-time[3] :referrer',
				{
					stream: {
						write: (str: string) => this.logger.debug(str.replace('\n', ''), {
							topic: TOPICS.EXPRESS,
							event: EVENTS.ENDPOINT_HIT
						})
					}
				}
			)
		);
		this.logger.debug(MESSAGES.SERVER.MIDDLEWARES.LOADED('morgan'), { topic: TOPICS.EXPRESS, event: EVENTS.INIT });
	}

	private parseRouteEndpoints(route: Route, defaultPath: string, endpoints: { [key: string]: string}) {
		if (typeof route.endpoint![0] === 'string') {
			if (route.root) {
				route.endpoint = (route.endpoint as string[]).map(r => path.join('/', r));
			} else {
				route.endpoint = (route.endpoint as string[]).map(r => path.join('/', defaultPath, '/', r));
			}
		}

		route.endpoint!.forEach((r: string | RegExp) => {
			r = r.toString();
			// if (Object.keys(endpoints).includes(r)) {
			// Find another method to check for duplicate routes (make account for methods GET/POST/DELETE/...)
			// throw new Error(`Duplicate endpoint found ${r} - conflict: ${route.id} and ${endpoints[r]}`);
			// }

			endpoints[r] = route.id;
		});

		return endpoints;
	}

	public async init() {
		process.on('unhandledRejection', error => {
			this.logger.error((error as string), {
				topic: TOPICS.UNHANDLED_REJECTION,
				event: EVENTS.ERROR
			});
		});

		this.db = Database;
		await this.db.connect();
		this.logger.info(MESSAGES.DB.CONNECTED, { topic: TOPICS.TYPEORM, event: EVENTS.INIT });

		try {
			await this.ipc.connectTo(this.config.ipc.port);
		} catch (error) {
			this.logger.error(MESSAGES.IPC.CLIENT.NO_CONNECTION(this.config.ipc.port), { topic: TOPICS.IPC, event: EVENTS.ERROR });
			process.exit(1);
		}

		this.setMiddlewares();
		this.logger.info(MESSAGES.SERVER.MIDDLEWARES.ALL, { topic: TOPICS.EXPRESS, event: EVENTS.INIT });

		await this.loadAll();

		this.logger.info(
			MESSAGES.SERVER.HANDLER.LOADED(Object.values(this.methods).length, Object.values(this.endpoints).length),
			{
				topic: TOPICS.EXPRESS,
				event: EVENTS.INIT
			}
		);

		this.server.get('/favicon.ico', (_, res) => res.redirect('/favicon.png'));

		// Listen the server
		this.server.listen(this.config.server.port);
		this.logger.info(MESSAGES.SERVER.LISTENING(this.config.server.port), {
			topic: TOPICS.EXPRESS,
			event: EVENTS.READY
		});
	}

	public register(file: Route): Route {
		if (Object.keys(this.methods).includes(file.id)) {
			throw new Error(ERRORS.SERVER.ROUTE_ALREADY_LOADED(file.id));
		}

		this.parseRouteEndpoints(file, this.path, this.endpoints);
		this.methods[file.id] = file;

		return file;
	}

	public async load(file: Route): Promise<Route> {
		const handler: RequestHandler = async (req, res, next): Promise<void> => {
			try {
				await file.exec(req, res, next);
			} catch (error) {
				this.logger.error(error, { topic: TOPICS.EXPRESS_HANDLER });
				res
					.status(500)
					.json({ error: error.message || ERRORS.SERVER.HANDLER_ERROR });
			}
		};

		if (file.middlewares) {
			// @ts-ignore
			this.server[file.method!](file.endpoint!, ...file.middlewares, handler);
		} else {
			// @ts-ignore
			this.server[file.method!](file.endpoint!, handler);
		}

		if (this.DEV) {
			this.logger.debug(MESSAGES.SERVER.HANDLER.ROUTE_LOADED(file.id), {
				topic: TOPICS.EXPRESS,
				event: EVENTS.INIT
			});
		}

		return file;
	}

	public async loadAll() {
		const methodFiles = readdirRecursive(this.API_METHODS);

		for (const method of methodFiles) {
			const file: Route = new (require(method)).default();

			file.init({ logger: this.logger, db: this.db, ipc: this.ipc });

			this.register(file);
		}

		const files = Object.values(this.methods);
		files
			.sort((a, b) => a.order! - b.order!)
			.forEach(async file => {
				await this.load(file);
			});

		return this;
	}
}
