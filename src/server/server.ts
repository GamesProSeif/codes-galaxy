import * as express from 'express';
import Server from './structures/Server';

const app = express();
const server = new Server(app, 'api');
server.init();
