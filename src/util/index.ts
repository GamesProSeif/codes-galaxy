import { join, posix as path } from 'path';
import Route from '../server/structures/Route';
import * as fs from 'fs';

export function readdirRecursive(directory: string): string[] {
	const result: string[] = [];

	function read(dir: string) {
		const files = fs.readdirSync(dir);

		for (const file of files) {
			const filepath = join(dir, file);

			if (fs.statSync(filepath).isDirectory()) {
				read(filepath);
			} else {
				result.push(filepath);
			}
		}
	}

	read(directory);

	return result;
}

export function parseRouteEndpoints(route: Route, defaultPath: string, endpoints: { [key: string]: string}) {
	if (typeof route.endpoint![0] === 'string') {
		if (route.root) {
			route.endpoint = (route.endpoint as string[]).map(r => path.join('/', r));
		} else {
			route.endpoint = (route.endpoint as string[]).map(r => path.join('/', defaultPath, '/', r));
		}
	}

	route.endpoint!.forEach((r: string | RegExp) => {
		r = r.toString();
		if (Object.keys(endpoints).includes(r)) {
			// Find another method to check for duplicate routes (make account for methods GET/POST/DELETE/...)
			// throw new Error(`Duplicate endpoint found ${r} - conflict: ${route.id} and ${endpoints[r]}`);
		}

		endpoints[r] = route.id;
	});

	return endpoints;
}
