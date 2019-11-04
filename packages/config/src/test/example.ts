import '../util/env';
import { ConfigParser } from '../structures/ConfigParser';
import { join } from 'path';

const parser = new ConfigParser(join(process.cwd(), '..', '..', 'config-example.yml'));
parser.init();

const config = parser.config;

console.log(config);
