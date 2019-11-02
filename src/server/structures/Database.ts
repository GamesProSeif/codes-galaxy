import { ConnectionManager } from 'typeorm';
import Code from '../models/Code';

const manager = new ConnectionManager();
const connection = manager.create({
	type: 'mongodb',
	url: process.env.DB_URI,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	entities: [Code],
	database: process.env.NODE_ENV === 'development' ? 'codes-dev' : 'codes-prod'
});

export default connection;
