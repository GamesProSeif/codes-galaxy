import './util/env';
import * as express from 'express';
import Server from './structures/Server';

const start = async () => {
	const app = express();
	const server = new Server(app, 'api');
	await server.init();
	return server;
};

start();
