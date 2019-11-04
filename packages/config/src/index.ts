import './util/env';
import ConfigParser from './structures/ConfigParser';

const parser = new ConfigParser();
parser.init();

export const config = parser.config;
export * from './structures/Config';
export * from './structures/ConfigParser';

