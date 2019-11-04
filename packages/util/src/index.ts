import { join } from 'path';
import { readdirSync, statSync } from 'fs';

export function readdirRecursive(directory: string): string[] {
	const result: string[] = [];

	function read(dir: string) {
		const files = readdirSync(dir);

		for (const file of files) {
			const filepath = join(dir, file);

			if (statSync(filepath).isDirectory()) {
				read(filepath);
			} else {
				result.push(filepath);
			}
		}
	}

	read(directory);

	return result;
}

export * from './logger';
