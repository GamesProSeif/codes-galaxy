import { ConnectionManager } from 'typeorm';
// import models


const manager = new ConnectionManager();
const connection = manager.create({
	type: 'mongodb',
	url: process.env.DB_URI,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	// entities: [],
	database: process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
});

export default connection;
