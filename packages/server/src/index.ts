import { ConfigParser } from '@codes/config';
import * as express from 'express';
import Server from './structures/Server';

const parser = new ConfigParser();
parser.init();
const config = parser.config;

const start = async () => {
	const app = express();
	const server = new Server(app, 'api', config);
	await server.init();
	return server;
};

start();
