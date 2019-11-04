import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';
import { Config } from './Config';

export class ConfigParser {
	public config!: Config;
	public path: string;

	public constructor(path?: string) {
		this.path = path || join(process.cwd(), '..', '..', 'config.yml');
	}

	public init() {
		const data = this.parseFile();
		this.config = new Config(data);
	}

	private parseFile() {
		try {
			const file = readFileSync(this.path, { encoding: 'utf-8' });
			const parsed = parse(file);
			return parsed;
		} catch (err) {
			if (err.code !== 'ENOENT') console.error(err);
		}
	}
}
