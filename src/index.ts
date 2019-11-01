import { logger, TOPICS, EVENTS } from './util/logger';

logger.info('Starting app', { topic: TOPICS.MAIN, event: EVENTS.INIT });

import './util/env';
import './bot/bot';
import './server/server';
