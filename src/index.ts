import { logger, TOPICS, EVENTS } from './util/logger';

import './util/env';
import runBot from './bot/bot';
import runServer from './server/server';

const start = async () => {
	logger.info('Starting app', { topic: TOPICS.MAIN, event: EVENTS.INIT });
	await runBot();
	await runServer();
};

start();
