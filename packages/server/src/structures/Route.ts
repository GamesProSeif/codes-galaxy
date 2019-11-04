import { NextFunction, Request, Response, RequestHandler } from 'express';
import { Connection } from 'typeorm';
import { Logger } from '@codes/util';
import { Client } from 'veza';

type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export default abstract class Route {
	public method?: RequestMethod;
	public endpoint?: string[] | RegExp[];
	public logger!: Logger;
	public db!: Connection;
	public ipc!: Client;
	public root?: boolean;
	public order?: number;
	public middlewares?: RequestHandler[];
	public DEV = process.env.NODE_ENV === 'development';

	public constructor(options?: {
		method?: RequestMethod;
		root?: boolean;
		endpoint?: string | string[] | RegExp;
		order?: number;
		middlewares?: RequestHandler[];
	}) {
		this.method = options!.method;

		this.root = options!.root || false;

		if (typeof options!.endpoint === 'string') {
			this.endpoint = [options!.endpoint];
		} else if (options!.endpoint instanceof RegExp) {
			this.endpoint = [options!.endpoint];
			this.root = true;
		} else {
			this.endpoint = options!.endpoint;
		}

		this.order = options!.order || 0;

		this.middlewares = options!.middlewares;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public exec(_req: Request, _res: Response, _next?: NextFunction): void | Promise<void> {
		throw new Error('You cannot invoke this base class method.');
	}

	public get id(): string {
		return this.constructor.name;
	}

	public init(data: {
		logger: Logger;
		db: Connection;
		ipc: Client;
	}): Route {
		this.logger = data.logger;
		this.db = data.db;
		this.ipc = data.ipc;

		return this;
	}
}
