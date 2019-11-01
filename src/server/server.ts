import * as express from 'express';
import Server from './structures/Server';

export default async () => {
	const app = express();
	const server = new Server(app, 'api');
	await server.init();
	return server;
};
