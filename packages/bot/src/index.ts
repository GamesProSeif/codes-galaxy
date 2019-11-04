import { ConfigParser } from '@codes/config';
import CodesClient from './client/CodesClient';

const start = async () => {
	const parser = new ConfigParser();
	parser.init();
	const config = parser.config;

	const client = new CodesClient(config);
	await client.start();
	return client;
};

start();
