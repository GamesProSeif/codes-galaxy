import { ConfigParser } from '@codes/config';
import { ConnectionManager } from 'typeorm';
import { Code } from '../models/Code';
import { User } from '../models/User';

const parser = new ConfigParser();
parser.init();
const config = parser.config;

const manager = new ConnectionManager();
export const Database = manager.create({
	type: 'mongodb',
	url: config.db.uri,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	entities: [Code, User],
	database: process.env.NODE_ENV === 'development' ? 'codes-dev' : 'codes-prod'
});
